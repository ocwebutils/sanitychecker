import type { FastifyReply, FastifyRequest } from "fastify";

import ConfigModel from "server/database/models/Config.js";
import type { ConfigResult } from "server/interfaces/metadata.interface.js";
import type { Route } from "server/interfaces/routes.interface.js";

type OptionalResult = Partial<ConfigResult> & {
	configData: string;
	configId: string;
};
type queryResult = OptionalResult | null;

const routeSchema = {
	params: {
		type: "object",
		required: ["configId"],
		properties: {
			configId: {
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

const getConfig: Route = {
	url: "/download/:configId",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (req: FastifyRequest<{ Params: { configId: string } }>, res: FastifyReply): Promise<typeof res> => {
		const { configId } = req.params;

		const query = (await ConfigModel.findOne({ configId }, { _id: 0, __v: 0 }).lean()) as queryResult;
		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });

		// biome-ignore lint/performance/noDelete: <explanation>
		delete query.createdBy;

		res.header("Content-Disposition", 'attachment; filename="config.plist"');
		res.header("Content-Type", "application/octet-stream");

		const fileContent = query.configData.toString();

		return res.send(fileContent);
	}
};

export default getConfig;
