import { FastifyRequest } from "fastify";

import { getCPUModels } from "../../util/file";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { CPUGenerations } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const getSupportedCPUGenerations: Route = {
	url: "/supportedCPUGenerations",
	method: "GET",
	handler: async (_: FastifyRequest, res: ReplyPayload<BasicResponse<CPUGenerations>>): Promise<typeof res> => {
		const file = await getCPUModels();
		if (!file) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		return res.send({ success: true, data: file });
	}
};

export default getSupportedCPUGenerations;
