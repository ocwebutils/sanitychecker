import { FastifyReply, FastifyRequest } from "fastify";

import { version as apiVersion } from "../../../package.json";
import { version as rulesVersion } from "@ocwebutils/sanitychecker_rules/package.json";

export const getVersions = async (req: FastifyRequest, res: FastifyReply) => {
	if (!rulesVersion || !apiVersion) return res.status(500).send({ success: true, error: "Couldn't read versions" });
	return res.send({ success: true, data: { rulesVersion, apiVersion } });
};
