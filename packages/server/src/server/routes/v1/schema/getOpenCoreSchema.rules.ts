import { FastifyRequest } from "fastify";

import { getSchema } from "../../../util/file";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";
import { JSONSchema7 } from "json-schema";

const getOpenCoreSchema: Route = {
	url: "/schema/:version",
	method: "GET",
	handler: async (req: FastifyRequest<{ Params: { version: string } }>, res: ReplyPayload<BasicResponse<JSONSchema7>>): Promise<typeof res> => {
		const file = await getSchema(req.params.version);
		if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		return res.send({ success: true, data: file });
	}
};

export default getOpenCoreSchema;
