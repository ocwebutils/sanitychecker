import { FastifyReply, FastifyRequest } from "fastify";

import { context } from "../../database";
import { deleteOldResults } from "../../util/deleteOldResults";
import { uuidValidate } from "../../util/uuidValidate";

type result = {
	id?: string;
	createdBy?: string;
	expireDate?: number;
	resultId: string;
	results?: Object;
	metadata: Object;
};

export const uploadedResults = async (req: FastifyRequest, res: FastifyReply) => {
	const user = req.headers["x-user-id"] as string;

	if (!user || !uuidValidate(user)) return res.status(403).send({ success: false, error: "No 'user-id' header is provided" });

	await deleteOldResults();

	const query = await context.prisma.results.findMany({
		where: {
			createdBy: user as string
		}
	});

	if (!query) return res.status(404).send({ success: false, error: "Error occurred. Server couldn't return a result" });

	const newQuery = query.map(({ results, ...item }: result) => item);

	return res.send({ success: true, data: newQuery });
};
