import { FastifyReply, FastifyRequest } from "fastify";

import { getCPUModels } from "../../util/file";

export const supportedCPUGenerations = async (req: FastifyRequest, res: FastifyReply) => {
	const file = await getCPUModels();

	if (!file) return res.status(500).send({ success: false, error: "Couldn't read the list with supported CPU generations" });
	return res.send({ success: true, data: file });
};
