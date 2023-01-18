export type ValueType = {
	path: string;
	actualValue: string;
	expectedValue?: string;
	ruleSet: RuleSet;
};

export type SchemaType = {
	path: string;
	expectedValue: string;
	type: string;
	ruleSet: RuleSet;
};

export type RuleSet = {
	type: "info" | "warning" | "error" | "success";
	message: string | null;
};
