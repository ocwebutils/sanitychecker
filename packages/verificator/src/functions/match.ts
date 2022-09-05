/**
 * Match warnings or information keys and return boolean
 * @param {[string, any]} input - Input Key
 * @param {string} rule - Ruleset
 * @param {("info"|"warning"|"error")} - Type of ruleSet
 * @returns {boolean} - Boolean if input matches warnings or information key
 */
const matchValue = (input: [string, any], rule: string, type: "info" | "warning" | "error"): boolean => {
	if (!input || !rule) return false;
	const [ruleKey] = rule.split(": ").map(item => item.trim());
	const [inputKey] = input.map(item => item.toString().trim());
	if (inputKey.match(new RegExp(ruleKey)) && type !== "error") {
		return true;
	}
	return false;
};

export { matchValue };
