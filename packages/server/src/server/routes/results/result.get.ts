import { FastifyReply, FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata";
import { context } from "../../database";
import { deleteOldResults } from "../../util/deleteOldResults";

export const getResult = async (req: FastifyRequest<{ Params: { resultId: string } }>, res: FastifyReply) => {
	const { resultId } = req.params;

	await deleteOldResults();

	const query = (await context.prisma.results.findFirst({
		where: {
			resultId: resultId
		}
	})) as Partial<Pick<Result, "id" | "createdBy" | "expireDate">> | null;

	if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });

	delete query.id;

	delete query.createdBy;
	delete query.expireDate;

	return res.send({ success: true, data: query });
};
