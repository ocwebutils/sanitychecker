import { FastifyReply, FastifyRequest } from "fastify";

import { getSchema } from "../../util/file";

export const ocSchema = async (req: FastifyRequest<{ Params: { version: string } }>, res: FastifyReply) => {
	const file = await getSchema(req.params.version);

	if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });
	return res.send({ success: true, data: file });
};
