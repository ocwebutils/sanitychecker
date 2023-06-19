import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { deleteOldResults } from "../../../util/deleteOldResults";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

type queryResult = Partial<Pick<Result, "id" | "createdBy" | "expireDate">> | null;

const routeSchema = {
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
				},
				data: {
					type: "object",
					additionalProperties: true
				}
			}
		},
		404: {
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

const getResult: Route = {
	url: "/result/:resultId",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Params: { resultId: string } }>, res: ReplyPayload<BasicResponse<queryResult>>): Promise<typeof res> => {
		if (req.validationError)
			return res.status(400).send({ success: false, error: `${req.validationError.validationContext} ${req.validationError.validation[0].message}` });

		const { resultId } = req.params;

		await deleteOldResults();

		const query = (await context.prisma.results.findFirst({
			where: {
				resultId: resultId
			}
		})) as queryResult;

		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });

		delete query.id;
		delete query.createdBy;
		delete query.expireDate;

		return res.send({ success: true, data: query });
	}
};

export default getResult;
