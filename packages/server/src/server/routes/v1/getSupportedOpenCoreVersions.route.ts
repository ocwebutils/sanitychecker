import { FastifyRequest } from "fastify";

import { getOCVersions } from "../../util/file";
import { BasicResponse, OpenCoreVersions, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const getSupportedOpenCoreVersions: Route = {
	url: "/supportedOCVersions/:codename",
	method: "GET",
	handler: async (req: FastifyRequest<{ Params: { codename: string } }>, res: ReplyPayload<BasicResponse<OpenCoreVersions>>): Promise<typeof res> => {
		const { codename } = req.params;
		if (!codename) return res.status(500).send({ success: false, error: "Required data isn't specified" });

		const returnObj = await getOCVersions(codename);
		if (!returnObj) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		return res.send({ success: true, data: { supportedVersions: returnObj.supportedVersions } });
	}
};

export default getSupportedOpenCoreVersions;
