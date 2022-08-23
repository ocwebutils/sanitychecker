import Ajv, { DefinedError } from "ajv";

import { addSuffix } from "./addSuffix";
import { parse } from "json5";

const censoredKeys = ["MLB", "SystemSerialNumber", "SystemUUID"];

function getLength(input: object | Array<object>): number {
	if (Array.isArray(input)) {
		return input.length;
	}
	// Get object entries length if input is an object
	if (typeof input === "object") {
		return Object.keys(input).length;
	}
	return -1;
}

function compareLength(input: object | Array<object>, expected: string): boolean {
	const [key, value] = expected.split(": ");
	if (!key || !value) return false;
	switch (key.toLowerCase()) {
		case "mincount":
			return getLength(input) >= parseInt(value);
		case "maxcount":
			return getLength(input) <= parseInt(value);
		case "count":
			return getLength(input) === parseInt(value);
		default:
			return false;
	}
}

function compareArray(input: any[], rule: any[]): boolean {
	if (rule.length !== input.length) return false;

	// Check if element inside array is a string
	if (typeof input[0] === "string") {
		return rule.every(item => input.includes(item));
	}

	// Otherwise, this will check if the values are the same at the same index
	for (let i = 0; i < rule.length; i++) {
		if (rule[i] !== input[i]) return false;
	}
	return true;
}

function parseObject(input: string) {
	try {
		return parse(input);
	} catch {
		return;
	}
}

/**
 * If keys don't match, return false
 *
 * If value doesn't match the expected value, return true
 */
function compareValue(input: string[], rule: string, req: "match" | "diff" = "diff"): boolean {
	const [ruleKey, ruleValue] = rule.split(": ").map(item => item.trim());
	const [inputKey, inputValue] = input.map(item => item.toString().trim());
	if (!ruleKey || !ruleValue || input.length < 2) return false;

	if (Array.isArray(parseObject(ruleValue)) && Array.isArray(input[1])) {
		switch (req) {
			case "match":
				return compareArray(input[1], parseObject(ruleValue));
			case "diff":
				return !compareArray(input[1], parseObject(ruleValue));
		}
	}

	switch (req) {
		case "match":
			return Boolean(inputKey.match(new RegExp(ruleKey)) && inputValue.match(new RegExp(ruleValue)));
		case "diff":
			return Boolean(inputKey.match(new RegExp(ruleKey)) && !inputValue.match(new RegExp(ruleValue)));
	}
}

function handleWarningOrInfo(input: [string, any], rule: string, type: "info" | "warning" | "error"): boolean {
	if (!input || !rule) return false;
	const [ruleKey] = rule.split(": ").map(item => item.trim());
	const [inputKey] = input.map(item => item.toString().trim());
	if (inputKey.match(new RegExp(ruleKey)) && type !== "error") {
		return true;
	}
	return false;
}

function isObject(obj: any): boolean {
	return obj === Object(obj);
}

function censorValue(entry: string[]): string {
	const [key, value] = entry.map(item => item.toString().trim());
	if (!censoredKeys.includes(key)) return value;
	return value?.replace(/[\w\d]/g, "*");
}

function resolveDep(config: any, rule: string): boolean {
	if (!config || !rule) return false;
	const path = rule.split(new RegExp(": (.*)", "s")).filter(i => i.length > 0);
	let result = false;

	path[0].split("/").forEach((key, index) => {
		if (config[key] && index < path[0].split("/").length - 1) {
			config = config[key];
		} else if (index === path[0].split("/").length - 1) {
			// Assuming array of objects
			if (Array.isArray(config)) {
				if (path[1].includes("/")) {
					const [value, targetRule] = path[1].split("/");
					const [targetKey, targetValue] = targetRule.split(": ");

					config = config.find(item => item[key]?.toString() === value);
					result = config[targetKey]?.toString() === targetValue;
				} else {
					result = !!config.find(item => item[key]?.toString() === path[1]);
				}
			} else if (isObject(config)) {
				result = config[key]?.toString() === path[1];
			}
		}
	});
	return result;
}

/**
 * God knows why and how this works
 */
export function ruleCheck(config: { [s: string]: unknown } | ArrayLike<unknown>, rules: { [x: string]: { [x: string]: any } }) {
	const returnArray: { path: string; actualValue: string; expectedValue?: string; ruleSet: any }[] = [];
	Object.entries(config).forEach(key => {
		// first loop
		if (!rules[key[0]]) return;

		Object.entries(key[1] as object).forEach(value => {
			const ruleSet = rules[key[0]][value[0]];

			// second loop

			if (!Array.isArray(value[1]) && !isObject(value[1])) {
				const matchedRules = Object.keys(rules[key[0]])
					.filter(rule => rule.includes(value[0]))
					.filter(rule => compareValue(value, rule));

				const unmatchedRules = Object.keys(rules[key[0]])
					.filter(rule => rule.includes(value[0]))
					.filter(rule => !compareValue(value, rule));

				if (matchedRules.length > 0) {
					matchedRules.forEach(rule => {
						const propValue = rule.split(": ");
						const returnObject = {
							type: rules[key[0]][rule].type,
							message: rules[key[0]][rule].message?.replace("{0}", propValue[0])?.replace("{1}", propValue[1])
						};
						returnArray.push({
							path: `${key[0]}/${value[0]}`,
							actualValue: value[1],
							expectedValue: propValue[1],
							ruleSet: returnObject
						});
					});
				}

				if (unmatchedRules.length > 0) {
					unmatchedRules.forEach(rule => {
						const propValue = rule.split(": ");
						const returnObject = {
							type: "success",
							message: null
						};
						returnArray.push({
							path: `${key[0]}/${value[0]}`,
							actualValue: value[1],
							expectedValue: propValue[1],
							ruleSet: returnObject
						});
					});
				}
			} else if (Array.isArray(value[1]) && ruleSet) {
				let unmatchedRule: (string | undefined)[] = [];

				if (value[1].length === 0) {
					for (const rule in ruleSet) {
						if (rule.includes("Count:") && !compareLength(value[1], rule) && !unmatchedRule.includes(rule)) {
							const propValue = rule.split(": ");
							const returnObject = {
								type: ruleSet[rule].type,
								message: ruleSet[rule].message?.replace("{0}", propValue[0])?.replace("{1}", propValue[1])
							};
							returnArray.push({
								path: `${key[0]}/${value[0]}/${propValue[0]}`,
								actualValue: value[1].length.toString(),
								expectedValue: `${propValue[1]} ${propValue[0].toLowerCase() === "mincount" ? "or more" : "or less"}`,
								ruleSet: returnObject
							});
							//console.error(`Length does not meet requirement: ${key[0]}.${value[0]}.${rule}`, ruleSet[rule]);
							unmatchedRule.push(rule);
						}
					}
				} else {
					(value[1] as Array<object>).forEach((obj, index) => {
						// insane nested loops
						for (const rule in ruleSet) {
							if (rule.includes("Count:") && !compareLength(value[1], rule) && !unmatchedRule.includes(rule)) {
								const propValue = rule.split(": ");
								const returnObject = {
									type: ruleSet[rule].type,
									message: ruleSet[rule].message?.replace("{0}", propValue[0])?.replace("{1}", propValue[1])
								};
								returnArray.push({
									path: `${key[0]}/${value[0]}/${propValue[0]}`,
									actualValue: value[1].length.toString(),
									expectedValue: `${propValue[1]} ${propValue[0].toLowerCase() === "mincount" ? "or more" : "or less"}`,
									ruleSet: returnObject
								});
								//console.error(`Length does not meet requirement: ${key[0]}.${value[0]}.${rule}`, ruleSet[rule]);
								unmatchedRule.push(rule);
							} else {
								const driverName = (obj as any).Path ?? (obj as any).BundlePath ?? (obj as any).Comment;
								Object.entries(obj).forEach(subValue => {
									// idk why and don't want to know why
									// ignore comments
									if (rule.includes("Count:") || subValue[0] === "Comment") return;

									const propValue = rule.split(": ");
									const driver = driverName ? driverName : addSuffix(index + 1);
									const instance = `${key[0]}/${value[0]}/${driver}`;
									const path = `${instance}/${propValue[0]}`;

									if (compareValue(subValue, rule)) {
										// Throw error if rule has negative lookahead or not a string
										if (propValue[1].includes("?!") || typeof subValue[1] === "boolean" || typeof subValue[1] === "number") {
											const returnObject = {
												type: ruleSet[rule].type,
												message: ruleSet[rule].message?.replace("{0}", driver)?.replace("{1}", propValue[1])
											};
											returnArray.push({
												path,
												actualValue: subValue[1].toString(),
												expectedValue: propValue[1],
												ruleSet: returnObject
											});
										} else unmatchedRule.push(rule);
									} else if (
										compareValue(subValue, rule, "match") &&
										(typeof subValue[1] === "boolean" || typeof subValue[1] === "number") &&
										returnArray.filter(item => item.path.startsWith(instance)).length === 0
									) {
										const returnObject = {
											type: "success",
											message: null
										};
										returnArray.push({
											path,
											actualValue: subValue[1].toString(),
											ruleSet: returnObject
										});
									}

									if (unmatchedRule.filter(rl => rl === rule).length === value[1].length) {
										const returnObject = {
											type: ruleSet[rule].type,
											message: ruleSet[rule].message?.replace("{0}", propValue[1])
										};
										returnArray.push({
											path: `${key[0]}/${value[0]}`,
											actualValue: propValue[1],
											expectedValue: propValue[1],
											ruleSet: returnObject
										});
										unmatchedRule = unmatchedRule.map(rl => {
											if (rl !== rule) return rl;
										});
									}
								});
							}
						}
					});
				}
			} else if (ruleSet) {
				// another insane nested loops
				Object.entries(value[1]).forEach((obj, index) => {
					if (isObject(obj[1])) {
						Object.entries(obj[1] as object).forEach(subValue => {
							const subRuleset = ruleSet[obj[0]];
							if (!subRuleset) return;

							if (isObject(subValue[1]) && !Array.isArray(subValue[1])) {
								Object.entries(subValue[1] as string[]).forEach(subObj => {
									const propSet = subRuleset[subValue[0]];
									if (!propSet) return;

									Object.keys(propSet).forEach(prop => {
										const propValue = prop.split(": ");
										if (compareValue(subObj, prop)) {
											const returnObject = {
												type: propSet[prop].type,
												message: propSet[prop].message?.replace("{0}", subObj[1])
											};
											returnArray.push({
												path: `${key[0]}/${value[0]}/${obj[0]}/${subObj[0]}`,
												actualValue: `[${subObj[1].toString()}]`,
												expectedValue: propValue[1],
												ruleSet: returnObject
											});
										}
									});
								});
							} else {
								Object.keys(subRuleset).forEach(rule => {
									const propValue = rule.split(": ");
									const path = `${key[0]}/${value[0]}/${index}/${obj[0]}/${subValue[0]}`;
									if (rule.includes("Count:") && !compareLength(obj[1] as object, rule)) {
										console.error(`${key[0]}.${value[0]}.${rule}`);
									} else if (compareValue(subValue, rule)) {
										const returnObject = {
											type: subRuleset[rule].type,
											message: subRuleset[rule].message?.replace("{0}", subValue[0])?.replace("{1}", subValue[1])
										};
										returnArray.push({
											path,
											actualValue: subValue[1],
											expectedValue: propValue[1],
											ruleSet: returnObject
										});
									} else if (compareValue(subValue, rule, "match")) {
										const returnObject = {
											type: "success",
											message: null
										};
										returnArray.push({
											path,
											actualValue: censorValue(subValue),
											ruleSet: returnObject
										});
									}
								});
							}
						});
					} else {
						for (const rule in ruleSet) {
							const ruleSplit = rule.split(": ");
							const path = `${key[0]}/${value[0]}/${obj[0]}`;
							if (rule.includes("Count:") && !compareLength(obj, rule)) {
								console.error(ruleSet[rule]);
							} else if (handleWarningOrInfo(obj, rule, ruleSet[rule].type) || compareValue(obj as string[], rule)) {
								const returnObject = {
									type: ruleSet[rule].type,
									message: ruleSet[rule].message?.replace("{0}", ruleSplit[0])?.replace("{1}", ruleSplit[1])
								};
								returnArray.push({
									path,
									actualValue: obj[1] as string,
									expectedValue: ruleSplit[1],
									ruleSet: returnObject
								});
							} else if (compareValue(obj as string[], rule, "match")) {
								const returnObject = {
									type: "success",
									message: null
								};
								returnArray.push({
									path,
									actualValue: censorValue(obj as string[]),
									ruleSet: returnObject
								});
								if (ruleSet[rule].requires && !resolveDep(config, ruleSet[rule].requires)) {
									const returnObject = {
										type: "error",
										message: `${rule} is dependent on ${ruleSet[rule].requires}`
									};
									returnArray.push({
										path,
										actualValue: censorValue(obj as string[]),
										ruleSet: returnObject
									});
								}
							}
						}
					}
				});
			}
		});
	});
	return returnArray;
}

export function schemaCheck(config: { [s: string]: unknown } | ArrayLike<unknown>, schema: any) {
	const errorArray: { path: string; expectedValue: string; type: string; ruleSet: { type: string; message: string } }[] = [];
	const missingRoot: string[] = [];
	const validator = new Ajv({ allErrors: true, strict: false });
	const validate = validator.compile(schema);
	const isValid = validate(config);

	if (!isValid && validate.errors) {
		validate.errors.forEach(error => {
			if (error.instancePath) {
				const returnObject = {
					type: "error",
					message: error.message as string
				};

				errorArray.push({
					path: error.instancePath.slice(1),
					expectedValue:
						error.params.missingProperty ??
						error.params.additionalProperty ??
						error.instancePath.split("/")[error.instancePath.split("/").length - 1],
					type: error.params?.type,
					ruleSet: returnObject
				});
			} else missingRoot.push(error.params.missingProperty);
		});
	}

	return { errorArray, missingRoot };
}
