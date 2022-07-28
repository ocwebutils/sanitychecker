import { FastifyReply, FastifyRequest } from "fastify";

import { context } from "../../database";
import { deleteOldResults } from "../../util/deleteOldResults";

type result = {
	id?: string;
	createdBy?: string;
	expireDate?: number;
	resultId: string;
	options?: {
		accessKey: string | null;
		private: boolean;
	};
	results: Object;
	metadata: Object;
};

export const getResult = async (req: FastifyRequest<{ Params: { resultId: string } }>, res: FastifyReply) => {
	const { resultId } = req.params;

	await deleteOldResults();

	const query = (await context.prisma.results.findFirst({
		where: {
			resultId: resultId
		}
	})) as result | null;

	if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in our database" });
	delete query.id;
	delete query.options;
	delete query.createdBy;
	delete query.expireDate;
	return res.send({ success: true, data: query });
};
