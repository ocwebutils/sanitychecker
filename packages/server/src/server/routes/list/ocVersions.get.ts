import { FastifyReply, FastifyRequest } from "fastify";

import { getOCVersions } from "../../util/file";

export const ocVersionsList = async (req: FastifyRequest, res: FastifyReply) => {
	const file = await getOCVersions();

	if (!file) return res.status(500).send({ success: true, error: "Couldn't read list with OpenCore versions" });
	return res.send({ success: true, data: file });
};
