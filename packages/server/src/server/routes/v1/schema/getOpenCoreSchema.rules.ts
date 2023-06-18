import { FastifyRequest } from "fastify";

import { getSchema } from "../../../util/file";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";
import { JSONSchema7 } from "json-schema";

const getOpenCoreSchema: Route = {
	url: "/schema",
	method: "GET",
	handler: async (req: FastifyRequest<{ Querystring: { v: string } }>, res: ReplyPayload<BasicResponse<JSONSchema7>>): Promise<typeof res> => {
		const { v: version } = req.query;
		if (!version) return res.status(400).send({ success: false, error: "Invalid request. Query `v` is missing" });
		const file = await getSchema(version);
		if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		return res.send({ success: true, data: file });
	}
};

export default getOpenCoreSchema;
