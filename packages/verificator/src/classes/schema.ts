import Ajv, { Options, ValidateFunction } from "ajv";

export class Schema {
	private ajvConfig: Options;
	private ajv: Ajv;
	private validator: ValidateFunction;
	private errorArray: { path: string; expectedValue: string; type: string; ruleSet: { type: string; message: string } }[];
	private missingRoot: string[];

	constructor(schema: any) {
		this.ajvConfig = {
			allErrors: true,
			strict: false
		};
		this.ajv = new Ajv(this.ajvConfig);
		this.validator = this.ajv.compile(schema);
		this.errorArray = [];
		this.missingRoot = [];
	}

	/**
	 * Validate config against schema
	 * @param {any} config - Provided config
	 */
	public validate(config: { [s: string]: unknown } | ArrayLike<unknown>) {
		const receivedResult = this.validator(config);

		if (!receivedResult && this.validator.errors) {
			for (const error of this.validator.errors) {
				if (error.instancePath) {
					const returnObject = {
						type: "error",
						message: error.message as string
					};

					this.errorArray.push({
						path: error.instancePath.slice(1),
						expectedValue:
							error.params.missingProperty ??
							error.params.additionalProperty ??
							error.instancePath.split("/")[error.instancePath.split("/").length - 1],
						type: error.params?.type,
						ruleSet: returnObject
					});
				} else this.missingRoot.push(error.params.missingProperty);
			}
		}
	}

	public toJSON() {
		const { errorArray, missingRoot } = this;
		return { errorArray, missingRoot };
	}
}
