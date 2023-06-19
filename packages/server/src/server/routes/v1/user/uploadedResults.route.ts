import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { deleteOldResults } from "../../../util/deleteOldResults";
import { uuidValidate } from "../../../util/uuidValidate";
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
	response: {
		200: {
			type: "object",
			properties: {
				success: {
					type: "boolean"
				},
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							id: {
								type: "string"
							},
							createdBy: {
								type: "string"
							},
							expireDate: {
								type: "string"
							},
							results: {
								type: "array"
							},
							metadata: {
								type: "object"
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
		}
	}
};

const uploadedResults: Route = {
	url: "/user/uploadedResults",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Headers: { "x-user-id": string } }>, res: ReplyPayload<BasicResponse<Result[]>>): Promise<typeof res> => {
		if (req.validationError)
			return res.status(400).send({ success: false, error: `${req.validationError.validationContext} ${req.validationError.validation[0].message}` });

		const { "x-user-id": user } = req.headers;

		if (!uuidValidate(user)) return res.status(403).send({ success: false, error: "Invalid request. Header 'user-id' doesn't include uuidv4" });

		await deleteOldResults();

		const query = (await context.prisma.results.findMany({
			where: {
				createdBy: user
			}
		})) as Result[];

		if (!query)
			return res.status(404).send({ success: false, error: "Sorry, we couldn't retrieve the requested data at this time. Please try again later." });

		const newQuery: Result[] = query.map(({ results, ...item }: Result) => item);

		return res.send({ success: true, data: newQuery });
	}
};

export default uploadedResults;
