import { FastifyReply, FastifyRequest } from "fastify";

import { getCPUModels } from "../../util/file";

export const supportedCPUGenerations = async (req: FastifyRequest, res: FastifyReply) => {
	const file = await getCPUModels();

	if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });
	return res.send({ success: true, data: file });
};
