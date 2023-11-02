import type { BasicResponse, Route, validateResult } from "server/interfaces/routes.interface.js";
import { ConfigChecker, SchemaChecker } from "@ocwebutils/sc_checker";
import type { RulesResult, SchemaResults, UploadMetadata } from "server/interfaces/metadata.interface.js";
import { getRules, getSchema } from "server/util/file.js";

import ConfigModel from "server/database/models/Config.js";
import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import ResultModel from "server/database/models/Result.js";
import { deleteOldResults } from "server/util/deleteOldResults.js";
import { randomUUID } from "node:crypto";
import { uuidValidate } from "server/util/uuidValidate.js";

const routeSchema = {
	body: {
		type: "object",
		required: ["metadata", "configBody"],
		properties: {
			metadata: {
				type: "object",
				required: ["uploadedBy", "ocVersion", "cpuDetails", "includeConfig"],
				properties: {
					uploadedBy: {
						type: "string"
					},
					includeConfig: {
						type: "boolean"
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
			configBody: {
				type: "object",
				required: ["data"],
				properties: {
					data: {
						type: "object",
						additionalProperties: true
					},
					buffer: {
						type: "string"
					}
				}
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
		req: FastifyRequest<{
			Body: {
				metadata: UploadMetadata;
				configBody: {
					data: { [s: string]: unknown };
					buffer?: string;
				};
			};
		}>,
		res: ReplyPayload<BasicResponse<validateResult>>
	): Promise<typeof res> => {
		deleteOldResults();

		const { metadata, configBody } = req.body;

		if (!validateMetadata(metadata)) return res.status(400).send({ success: false, error: "Required data isn't specified" });
		if (!checkCodename) return res.status(403).send({ success: false, error: "Please select a valid CPU model" });

		const ocSchema = await getSchema(metadata.ocVersion);
		if (!ocSchema) return res.send({ success: false, error: "This version of OpenCore isn't supported by Sanity Checker" });

		const schemaCheck = new SchemaChecker(ocSchema);
		const schemaResult = schemaCheck.validate(configBody.data) as SchemaResults,
			rules = await getRules(metadata.ocVersion, metadata.cpuDetails.codename);

		if (!rules) {
			return res
				.status(500)
				.send({ success: false, error: "We couldn't find rules for this specified CPU. It may not be supported by selected OpenCore version" });
		}

		const configCheck = new ConfigChecker(configBody.data);
		const rulesResult = configCheck.validate(rules) as RulesResult[],
			result = {
				rulesResults: rulesResult.length === 0 ? null : rulesResult,
				schemaResults: schemaResult
			},
			resultId = randomUUID(),
			configId = metadata.includeConfig ? randomUUID() : null;

		const resultQuery = new ResultModel({
			createdBy: metadata.uploadedBy,
			resultId,
			results: result,
			expireDate: Date.now() + 14 * 24 * 60 * 60 * 1000, //* 14 days
			metadata: {
				cpuCodename: metadata.cpuDetails.codename,
				cpuName: metadata.cpuDetails.name,
				ocVersion: metadata.ocVersion,
				configId
			}
		});

		if (configId) {
			const configQuery = new ConfigModel({
				configId,
				createdBy: metadata.uploadedBy,
				configData: Buffer.from(req.body.configBody.buffer as string, "base64")
			});

			configQuery.save().catch(() => {
				return res.status(500).send({ success: false, error: "We couldn't save your config inside our database. Please try again later" });
			});
		}

		await resultQuery.save().catch(() => {
			return res.status(500).send({ success: false, error: "We couldn't save your result inside our database. Try again later" });
		});

		return res.send({
			success: true,
			data: { resultId, results: result }
		});
	}
};

const validateMetadata = (metadata: UploadMetadata) => {
		if (
			!metadata?.uploadedBy ||
			!metadata?.ocVersion ||
			!metadata?.cpuDetails?.codename ||
			!metadata?.cpuDetails?.name ||
			metadata?.includeConfig === undefined
		)
			return false;
		if (!uuidValidate(metadata.uploadedBy)) return false;

		return true;
	},
	checkCodename = (cpuDetails: UploadMetadata["cpuDetails"]) => {
		if (cpuDetails.codename === "default") return false;

		return true;
	};

export default validateConfig;
