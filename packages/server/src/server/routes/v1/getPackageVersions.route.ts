import { FastifyRequest } from "fastify";

import { version as apiVersion } from "../../../../package.json";
import { version as rulesVersion } from "@ocwebutils/sc_rules/package.json";
import { Route, BasicResponse, packageVersions } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const getPackageVersions: Route = {
	url: "/packageVersions",
	method: "GET",
	handler: (_: FastifyRequest, res: ReplyPayload<BasicResponse<packageVersions>>) => {
		if (!rulesVersion || !apiVersion) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		return res.send({ success: true, data: { rulesVersion, apiVersion } });
	}
};

export default getPackageVersions;
