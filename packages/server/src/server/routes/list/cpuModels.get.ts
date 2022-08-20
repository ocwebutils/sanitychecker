import { FastifyReply, FastifyRequest } from "fastify";

import { getCPUModels } from "../../util/file";

export const cpuList = async (req: FastifyRequest, res: FastifyReply) => {
	const file = await getCPUModels();

	if (!file) return res.status(500).send({ success: false, error: "Couldn't read list with CPU models" });
	return res.send({ success: true, data: file });
};
