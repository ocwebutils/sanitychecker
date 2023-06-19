import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const routeSchema = {
	headers: {
		type: "object",
		required: ["x-user-id"],
		properties: {
			"x-user-id": {
				type: "string"
			}
		}
	},
	params: {
		type: "object",
		required: ["resultId"],
		properties: {
			resultId: {
				type: "string"
			}
		}
	},
	response: {
		200: {
			type: "object",
			properties: {
				success: {
					type: "boolean"
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

const deleteResult: Route = {
	url: "/result/:resultId",
	method: "DELETE",
	schema: routeSchema,
	attachValidation: true,
	handler: async (
		req: FastifyRequest<{ Headers: { "x-user-id": string }; Params: { resultId: string } }>,
		res: ReplyPayload<BasicResponse>
	): Promise<typeof res> => {
		if (req.validationError)
			return res.status(400).send({ success: false, error: `${req.validationError.validationContext} ${req.validationError.validation[0].message}` });

		const { resultId } = req.params,
			{ "x-user-id": user } = req.headers;

		const query = (await context.prisma.results.findFirst({
			where: {
				resultId: resultId
			}
		})) as Result | null;

		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in our database" });
		if (query.createdBy !== user) return res.status(403).send({ success: false, error: "You aren't allowed to delete this result" });

		const deleteQuery = await context.prisma.results.delete({
			where: {
				resultId: resultId
			}
		});
		if (!deleteQuery) return res.status(500).send({ success: false, error: "Couldn't delete result" });

		return res.send({ success: true });
	}
};

export default deleteResult;
