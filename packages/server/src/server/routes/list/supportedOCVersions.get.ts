import { FastifyReply, FastifyRequest } from "fastify";

import { getOCVersions } from "../../util/file";

export const supportedOCVersions = async (req: FastifyRequest<{ Params: { codename: string } }>, res: FastifyReply) => {
	const { codename } = req.params;
	if (!codename) return res.status(500).send({ success: false, error: "Required data isn't specified" });

	const returnObj = await getOCVersions(codename);

	if (!returnObj) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });
	return res.send({ success: true, data: { supportedVersions: returnObj.supportedVersions } });
};
