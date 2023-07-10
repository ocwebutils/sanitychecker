import { FastifyRequest } from "fastify";

import { getSchema } from "../../../util/file";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";
import { JSONSchema7 } from "json-schema";

const routeSchema = {
	querystring: {
		type: "object",
		required: ["v"],
		properties: {
			v: {
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

const getOpenCoreSchema: Route = {
	url: "/schema",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Querystring: { v: string } }>, res: ReplyPayload<BasicResponse<JSONSchema7>>): Promise<typeof res> => {
		const { v: version } = req.query;

		const file = await getSchema(version);
		if (!file)
			return res.status(500).send({ success: false, error: "Sorry, we couldn't retrieve the requested data at this time. Please try again later." });

		return res.send({ success: true, data: file });
	}
};

export default getOpenCoreSchema;
