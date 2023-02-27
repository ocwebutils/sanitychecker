import { ConfigChecker, SchemaChecker } from "@ocwebutils/sc_checker";
import { FastifyReply, FastifyRequest } from "fastify";
import { getRules, getSchema } from "../../util/file";

import { UploadMetadata } from "../../interfaces/metadata";
import { context } from "../../database";
import { deleteOldResults } from "../../util/deleteOldResults";
import { randomUUID } from "node:crypto";
import { uuidValidate } from "../../util/uuidValidate";

export const validateConfig = async (
		req: FastifyRequest<{ Body: { metadata: UploadMetadata; config: { [s: string]: unknown } } }>,
		res: FastifyReply
	) => {
		await deleteOldResults();

		const { metadata, config } = req.body;

		if (!config || !validateMetadata(metadata)) return res.status(400).send({ success: false, error: "Required data isn't specified" });

		if (!checkCodename) return res.status(403).send({ sucess: false, error: "Please select a valid CPU model" });

		const ocSchema = await getSchema(metadata.ocVersion);

		if (!ocSchema) return res.send({ success: false, error: "This version of OpenCore isn't supported by Sanity Checker" });

		const schemaCheck = new SchemaChecker(ocSchema);
		const schemaResult = await schemaCheck.validate(config),
			rules = await getRules(metadata.ocVersion, metadata.cpuDetails.codename);

		if (!rules) {
			return res
				.status(404)
				.send({ success: false, error: "Server couldn't find rules for specified CPU. This CPU may not be supported by selected OpenCore version" });
		}

		const configCheck = new ConfigChecker(config);
		const rulesResult = await configCheck.validate(rules),
			result = {
				rulesResults: rulesResult.length === 0 ? null : rulesResult,
				schemaResults: schemaResult
			},
			id = randomUUID();

		await context.prisma.results.create({
			data: {
				createdBy: metadata.uploadedBy,
				resultId: id,
				results: result,
				expireDate: Date.now() + 1000 * 60 * 60 * 72, //* 3 days (72 hours)
				metadata: {
					cpuCodename: metadata.cpuDetails.codename,
					cpuName: metadata.cpuDetails.name,
					ocVersion: metadata.ocVersion
				}
			}
		});

		return res.send({
			success: true,
			data: { results: result, resultId: id }
		});
	},
	validateMetadata = (metadata: UploadMetadata) => {
		if (!metadata?.uploadedBy || !metadata?.ocVersion || !metadata?.cpuDetails?.codename || !metadata?.cpuDetails?.name) return false;

		if (!uuidValidate(metadata.uploadedBy)) return false;
		return true;
	},
	checkCodename = (cpuDetails: UploadMetadata["cpuDetails"]) => {
		if (cpuDetails.codename === "default") return false;
		return true;
	};
