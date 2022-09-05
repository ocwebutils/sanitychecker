import { parseObject } from "../util/parseObject";

/**
 * Compares length of input to expected value
 * @param {(object|Array<object>)} input - Input Object or Array of objects
 * @param {string} expected - Expected value
 * @returns {boolean} - Boolean if input matches expected value
 */
const compareLength = (input: object | Array<object>, expected: string): boolean => {
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
	},
	/**
	 * Compares arrays
	 * @param {any[]} input - Input Array
	 * @param {any[]} rule - RuleSet
	 * @returns {boolean} - Boolean if input matches expected rule
	 */
	compareArray = (input: any[], rule: any[]): boolean => {
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
	},
	/**
	 * Compares values
	 * @param {string[]} input - Input Array of strings
	 * @param {string} rule - RuleSet
	 * @param {("match"|"diff")} [req=diff] - Option to match or check if input is different
	 * @returns {boolean} - Boolean if input matches expected rule and requirement
	 */
	compareValue = (input: string[], rule: string, req: "match" | "diff" = "diff"): boolean => {
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
	},
	/**
	 * Gets length of object or array of objects
	 * @param {(object|Array<object>)} input - Input object or array of objects
	 * @returns {number} - Length of object or array of objects
	 */
	getLength = (input: object | Array<object>): number => {
		if (Array.isArray(input)) {
			return input.length;
		}
		// Get object entries length if input is an object
		if (typeof input === "object") {
			return Object.keys(input).length;
		}
		return -1;
	};

export { compareLength, compareValue };
