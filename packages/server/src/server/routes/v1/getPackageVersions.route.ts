import { FastifyRequest } from "fastify";

import { version as apiVersion } from "../../../../package.json";
import { version as rulesVersion } from "@ocwebutils/sc_rules/package.json";
import { Route, BasicResponse, packageVersions } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const getPackageVersions: Route = {
	url: "/packageVersions",
	method: "GET",
	handler: (_: FastifyRequest, res: ReplyPayload<BasicResponse<packageVersions>>) => {
		return res.send({ success: true, data: { rulesVersion, apiVersion } });
	}
};

export default getPackageVersions;
