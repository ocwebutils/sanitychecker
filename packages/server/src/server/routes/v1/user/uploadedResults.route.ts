import type { BasicResponse, Route } from "server/interfaces/routes.interface.js";

import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import type { Result } from "server/interfaces/metadata.interface.js";
import ResultModel from "server/database/models/Result.js";
import { deleteOldResults } from "server/util/deleteOldResults.js";
import { uuidValidate } from "server/util/uuidValidate.js";

const routeSchema = {
	headers: {
		type: "object",
		required: ["x-user-id"],
		properties: {
			"x-user-id": {
				type: "string",
			},
		},
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
				},
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							createdBy: {
								type: "string",
							},
							expireDate: {
								type: "string",
							},
							resultId: {
								type: "string",
							},
							metadata: {
								type: "object",
								additionalProperties: true,
							},
						},
					},
				},
			},
		},
		"4xx": {
			type: "object",
			properties: {
				success: {
					type: "boolean",
				},
				error: {
					type: "string",
				},
			},
		},
	},
};

const uploadedResults: Route = {
	url: "/user/uploadedResults",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Headers: { "x-user-id": string } }>, res: ReplyPayload<BasicResponse<Result[]>>): Promise<typeof res> => {
		const { "x-user-id": user } = req.headers;

		if (!uuidValidate(user)) return res.status(403).send({ success: false, error: "Invalid request. Header 'user-id' doesn't include uuidv4" });

		await deleteOldResults();

		const query = (await ResultModel.find({ createdBy: user }, { _id: 0, __v: 0 })
			.lean()
			.sort({ expireDate: 1 })
			.select(["createdBy", "expireDate", "resultId", "metadata"])) as Result[];
		if (!query)
			return res.status(404).send({ success: false, error: "Sorry, we couldn't retrieve the requested data at this time. Please try again later." });

		return res.send({ success: true, data: query });
	},
};

export default uploadedResults;
