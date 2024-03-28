import type { BasicResponse, Route } from "server/interfaces/routes.interface.js";

import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import type { Result } from "server/interfaces/metadata.interface.js";
import ResultModel from "server/database/models/Result.js";
import { deleteOldResults } from "server/util/deleteOldResults.js";

type queryResult = Partial<Pick<Result, "createdBy" | "expireDate">> | null;

const routeSchema = {
	params: {
		type: "object",
		required: ["resultId"],
		properties: {
			resultId: {
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
					type: "object",
					additionalProperties: true,
				},
			},
		},
		404: {
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

const getResult: Route = {
	url: "/result/:resultId",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Params: { resultId: string } }>, res: ReplyPayload<BasicResponse<queryResult>>): Promise<typeof res> => {
		const { resultId } = req.params;

		await deleteOldResults();

		const query = (await ResultModel.findOne({ resultId }, { _id: 0, __v: 0 }).lean()) as queryResult;
		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });

		const newQuery = Object.create(query);

		// biome-ignore lint/performance/noDelete: <explanation>
		delete query.createdBy;
		// biome-ignore lint/performance/noDelete: <explanation>
		delete query.expireDate;

		return res.send({ success: true, data: query });
	},
};

export default getResult;
