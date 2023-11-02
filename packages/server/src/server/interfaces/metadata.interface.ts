export type UploadMetadata = {
	uploadedBy: string;
	includeConfig: boolean;
	ocVersion: string;
	cpuDetails: {
		codename: string;
		name: string;
	};
};

export type ResultMetadata = {
	cpuCodename: string;
	cpuName: string;
	ocVersion: string;
	configId?: string;
};

export type Result = {
	createdBy: string;
	expireDate: number;
	resultId: string;
	results?: Results;
	metadata: ResultMetadata;
};

export type ConfigResult = {
	configId: string;
	createdBy: string;
	configData: { [s: string]: unknown };
};

export type Results = {
	rulesResults: RulesResult[] | null;
	schemaResults: SchemaResults;
};

export type RulesResult = {
	path: string;
	actualValue: string | boolean | number | null;
	expectedValue?: string | undefined;
	ruleSet: RuleSet;
};

export type SchemaResult = Omit<RulesResult, "actualValue">;

export type RuleSet = {
	type: "info" | "warning" | "error" | "success";
	message: string | null;
};

export type SchemaResults = {
	errorArray: SchemaResult[];
	missingRoot: string[] | null;
};

export type CPUList = {
	codename: string;
	name: string;
	rules: string;
};
