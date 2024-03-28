import type { BasicResponse, Route } from "server/interfaces/routes.interface.js";

import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import type { Result } from "server/interfaces/metadata.interface.js";
import ResultModel from "server/database/models/Result.js";

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
		500: {
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

const deleteResult: Route = {
	url: "/result/:resultId",
	method: "DELETE",
	schema: routeSchema,
	attachValidation: true,
	handler: async (
		req: FastifyRequest<{ Headers: { "x-user-id": string }; Params: { resultId: string } }>,
		res: ReplyPayload<BasicResponse>
	): Promise<typeof res> => {
		const { resultId } = req.params,
			{ "x-user-id": user } = req.headers;

		const query = (await ResultModel.findOne({ resultId: resultId }).lean()) as Result | null;

		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });
		if (query.createdBy !== user) return res.status(403).send({ success: false, error: "You are unauthorized to delete this result" });

		const deleteQuery = await ResultModel.deleteOne({ resultId: resultId });
		if (!deleteQuery) return res.status(500).send({ success: false, error: "We couldn't delete the result. Try again later" });

		return res.send({ success: true });
	},
};

export default deleteResult;
