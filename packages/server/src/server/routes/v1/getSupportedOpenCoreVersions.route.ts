import { FastifyRequest } from "fastify";

import { getOCVersions } from "../../util/file";
import { BasicResponse, OpenCoreVersions, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const routeSchema = {
	querystring: {
		type: "object",
		required: ["codename"],
		properties: {
			codename: {
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
					properties: {
						supportedVersions: {
							type: "array",
							items: {
								type: "string"
							}
						}
					}
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

const getSupportedOpenCoreVersions: Route = {
	url: "/supportedOCVersions",
	method: "GET",
	schema: routeSchema,
	attachValidation: true,
	handler: async (
		req: FastifyRequest<{ Querystring: { codename: string } }>,
		res: ReplyPayload<BasicResponse<OpenCoreVersions>>
	): Promise<typeof res> => {
		if (req.validationError)
			return res.status(400).send({ success: false, error: `${req.validationError.validationContext} ${req.validationError.validation[0].message}` });

		const { codename } = req.query;

		const returnObj = await getOCVersions(codename);
		if (!returnObj)
			return res.status(500).send({ success: false, error: "Sorry, we couldn't retrieve the requested data at this time. Please try again later." });

		return res.send({ success: true, data: { supportedVersions: returnObj.supportedVersions } });
	}
};

export default getSupportedOpenCoreVersions;
