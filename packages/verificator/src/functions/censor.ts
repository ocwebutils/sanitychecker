import { censoredKeys } from "../config";

/**
 * Censor sensitive values in result
 * @param {string[]} entry - Input key with value to censor
 * @returns {string} - Censored key with value
 */
const censorValue = (entry: string[]): string => {
	const [key, value] = entry.map(item => item.toString().trim());
	if (!censoredKeys.includes(key)) return value;
	return value?.replace(/[\w\d]/g, "*");
};

export { censorValue };
