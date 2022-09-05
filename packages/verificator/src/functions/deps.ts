import { isObject } from "../util/isObject";

/**
 * Resolves dependency of rule
 * @param {any} config - Input config
 * @param {string} rule - Ruleset
 * @returns {boolean} - Boolean if dependency is found or not
 */
const resolveDep = (config: any, rule: string): boolean => {
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
};

export { resolveDep };
