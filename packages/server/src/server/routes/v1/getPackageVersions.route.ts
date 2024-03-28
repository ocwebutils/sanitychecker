import type { BasicResponse, Route, packageVersions } from "server/interfaces/routes.interface.js";

import type { FastifyRequest } from "fastify";
import type { ReplyPayload } from "server/interfaces/fastify.interface.js";
import { version as apiVersion } from "../../../../package.json" assert { type: "json" };
import { version as rulesVersion } from "@ocwebutils/sc_rules/package.json" assert { type: "json" };

const getPackageVersions: Route = {
	url: "/packageVersions",
	method: "GET",
	handler: (_: FastifyRequest, res: ReplyPayload<BasicResponse<packageVersions>>) => {
		return res.send({ success: true, data: { rulesVersion, apiVersion } });
	},
};

export default getPackageVersions;
