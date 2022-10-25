import { FastifyReply, FastifyRequest } from "fastify";

import { version as apiVersion } from "../../../package.json";
import { version as rulesVersion } from "@ocwebutils/sc_rules/package.json";

export const getPackageVersions = async (req: FastifyRequest, res: FastifyReply) => {
	if (!rulesVersion || !apiVersion) return res.status(500).send({ success: false, error: "Error occurred. Server couldn't return a result" });
	return res.send({ success: true, data: { rulesVersion, apiVersion } });
};
