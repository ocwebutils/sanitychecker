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

export type requestBody = {
	metadata: {
		uploadedBy: string;
		ocVersion: string;
		includeConfig: boolean;
		cpuDetails: {
			codename: string;
			name: string;
		};
	};
	configBody: {
		data: {
			[s: string]: unknown;
		};
		buffer?: string;
	};
};

export type cpuGenerations = {
	[key: string]: cpuModel;
};

export type cpuModel = { [index: string]: { displayName: string; codename: string }[] }
