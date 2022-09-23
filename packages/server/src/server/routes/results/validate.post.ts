import { ConfigChecker, SchemaChecker } from "@ocwebutils/sc_checker";
import { FastifyReply, FastifyRequest } from "fastify";
import { getRules, getSchema } from "../../util/file";
import { v4 as uuidV4, validate as uuidValidate } from "uuid";

import UploadMetadata from "../../interfaces/metadata";
import { context } from "../../database";
import { deleteOldResults } from "../../util/deleteOldResults";

export const validateConfig = async (
		req: FastifyRequest<{ Body: { metadata: UploadMetadata; config: { [s: string]: unknown } } }>,
		res: FastifyReply
	) => {
		await deleteOldResults();

		const { metadata, config } = req.body;

		if (!config || !validateMetadata(metadata)) return res.status(500).send({ success: false, error: "Required data is not specified" });

		if (!checkCodename) return res.status(403).send({ sucess: false, error: "Please select a valid CPU" });

		const ocSchema = await getSchema(metadata.ocVersion);

		if (!ocSchema) return res.send({ success: false, error: "This version of OpenCore is not supported by Sanity Checker" });

		const schemaCheck = new SchemaChecker(ocSchema);
		schemaCheck.validate(config);
		const schemaResult = await schemaCheck.toJSON(),
			rules = await getRules(metadata.ocVersion, metadata.cpuDetails.codename);

		if (!rules)
			return res
				.status(404)
				.send({ success: false, error: "Rules for specified CPU are not found. This CPU may not be supported by selected OpenCore version" });

		const configCheck = new ConfigChecker(config);
		configCheck.validate(rules);
		const rulesResult = await configCheck.toJSON(),
			result = {
				rulesResults: rulesResult.length === 0 ? null : rulesResult,
				schemaResults: schemaResult
			},
			id = uuidV4();

		await context.prisma.results.create({
			data: {
				createdBy: metadata.uploadedBy,
				resultId: id,
				results: result,
				expireDate: Date.now() + 1000 * 60 * 1440, //* 24 hours
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
