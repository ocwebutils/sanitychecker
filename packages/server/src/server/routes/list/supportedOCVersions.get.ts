import { FastifyReply, FastifyRequest } from "fastify";

import { getOCVersions } from "../../util/file";

export const supportedOCVersions = async (req: FastifyRequest, res: FastifyReply) => {
	const file = await getOCVersions();

	if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });
	return res.send({ success: true, data: file });
};
