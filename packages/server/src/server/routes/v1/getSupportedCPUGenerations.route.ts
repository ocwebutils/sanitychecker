import type { BasicResponse, Route } from "server/interfaces/routes.interface.js";

import type { CPUModelsList } from "server/util/file.js";
import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import { getCPUModels } from "server/util/file.js";

const routeSchema = {
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

const getSupportedCPUGenerations: Route = {
	url: "/supportedCPUGenerations",
	method: "GET",
	schema: routeSchema,
	handler: async (_: FastifyRequest, res: ReplyPayload<BasicResponse<CPUModelsList>>): Promise<typeof res> => {
		const file = await getCPUModels();
		if (!file)
			return res.status(500).send({ success: false, error: "Sorry, we couldn't retrieve the requested data at this time. Please try again later." });

		return res.send({ success: true, data: file });
	}
};

export default getSupportedCPUGenerations;
