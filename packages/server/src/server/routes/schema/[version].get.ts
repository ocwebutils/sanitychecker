import { FastifyReply, FastifyRequest } from "fastify";

import { getSchema } from "../../util/file";

export const ocSchema = async (req: FastifyRequest<{ Params: { version: string } }>, res: FastifyReply) => {
	const file = await getSchema(req.params.version);

	if (!file) return res.status(500).send({ success: true, error: "Couldn't read schema for this OpenCore version" });
	return res.send({ success: true, data: file });
};
