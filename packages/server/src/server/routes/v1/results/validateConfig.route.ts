import type { BasicResponse, Route, validateResult } from "server/interfaces/routes.interface.js";
import { ConfigChecker, SchemaChecker } from "@ocwebutils/sc_checker";
import type { RulesResult, SchemaResults, UploadMetadata } from "server/interfaces/metadata.interface.js";
import { getRules, getSchema } from "server/util/file.js";

import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import ResultModel from "server/database/models/Result.js";
import { deleteOldResults } from "server/util/deleteOldResults.js";
import { randomUUID } from "node:crypto";
import { uuidValidate } from "server/util/uuidValidate.js";

const routeSchema = {
	body: {
		type: "object",
		required: ["metadata", "config"],
		properties: {
			metadata: {
				type: "object",
				required: ["uploadedBy", "ocVersion", "cpuDetails"],
				properties: {
					uploadedBy: {
						type: "string"
					},
					ocVersion: {
						type: "string"
					},
					cpuDetails: {
						type: "object",
						required: ["codename", "name"],
						properties: {
							codename: {
								type: "string"
							},
							name: {
								type: "string"
							}
						}
					}
				}
			},
			config: {
				type: "object",
				additionalProperties: true
			}
		}
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: {
					type: "boolean"
				},
				data: {
					type: "object",
					properties: {
						resultId: {
							type: "string"
						},
						results: {
							type: "object",
							properties: {
								rulesResults: {
									type: "array",
									additionalItems: true
								},
								schemaResults: {
									type: "object",
									properties: {
										errorArray: {
											type: "array",
											additionalItems: true
										},
										missingRoot: {
											type: ["array", "null"],
											items: {
												type: "string"
											}
										}
									}
								}
							}
						}
					}
				}
			}
		},
		"4xx": {
			type: "object",
			properties: {
				success: {
					type: "boolean"
				},
				error: {
					type: "string"
				}
			}
		},
		500: {
			type: "object",
			properties: {
				success: {
					type: "boolean"
				},
				error: {
					type: "string"
				}
			}
		}
	}
};

const validateConfig: Route = {
	url: "/validateConfig",
	method: "POST",
	schema: routeSchema,
	attachValidation: true,
	handler: async (
		req: FastifyRequest<{ Body: { metadata: UploadMetadata; config: { [s: string]: unknown } } }>,
		res: ReplyPayload<BasicResponse<validateResult>>
	): Promise<typeof res> => {
		deleteOldResults();

		const { metadata, config } = req.body;

		if (!validateMetadata(metadata)) return res.status(400).send({ success: false, error: "Required data isn't specified" });
		if (!checkCodename) return res.status(403).send({ success: false, error: "Please select a valid CPU model" });

		const ocSchema = await getSchema(metadata.ocVersion);
		if (!ocSchema) return res.send({ success: false, error: "This version of OpenCore isn't supported by Sanity Checker" });

		const schemaCheck = new SchemaChecker(ocSchema);
		const schemaResult = schemaCheck.validate(config) as SchemaResults,
			rules = await getRules(metadata.ocVersion, metadata.cpuDetails.codename);

		if (!rules) {
			return res
				.status(500)
				.send({ success: false, error: "We couldn't find rules for this specified CPU. It may not be supported by selected OpenCore version" });
		}

		const configCheck = new ConfigChecker(config);
		const rulesResult = configCheck.validate(rules) as RulesResult[],
			result = {
				rulesResults: rulesResult.length === 0 ? null : rulesResult,
				schemaResults: schemaResult
			},
			id = randomUUID();

		const query = new ResultModel({
			createdBy: metadata.uploadedBy,
			resultId: id,
			results: result,
			expireDate: Date.now() + 14 * 24 * 60 * 60 * 1000, //* 14 days
			metadata: {
				cpuCodename: metadata.cpuDetails.codename,
				cpuName: metadata.cpuDetails.name,
				ocVersion: metadata.ocVersion
			}
		});

		await query.save().catch(() => {
			return res.status(500).send({ success: false, error: "We couldn't save your result. Try again later" });
		});

		return res.send({
			success: true,
			data: { resultId: id, results: result }
		});
	}
};

const validateMetadata = (metadata: UploadMetadata) => {
		if (!metadata?.uploadedBy || !metadata?.ocVersion || !metadata?.cpuDetails?.codename || !metadata?.cpuDetails?.name) return false;
		if (!uuidValidate(metadata.uploadedBy)) return false;

		return true;
	},
	checkCodename = (cpuDetails: UploadMetadata["cpuDetails"]) => {
		if (cpuDetails.codename === "default") return false;

		return true;
	};

export default validateConfig;
