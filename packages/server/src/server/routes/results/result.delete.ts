import { FastifyReply, FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata";
import { context } from "../../database";

export const deleteResult = async (req: FastifyRequest<{ Params: { resultId: string } }>, res: FastifyReply) => {
	const { resultId } = req.params,
		user = req.headers["x-user-id"];

	if (!user) return res.status(403).send({ success: false, error: "No user-id header is provided" });

	const query = (await context.prisma.results.findFirst({
		where: {
			resultId: resultId
		}
	})) as Result | null;

	if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in our database" });

	if (query.createdBy !== user) return res.status(403).send({ success: false, error: "You aren't allowed to delete this result" });

	const deleteQuery = await context.prisma.results.delete({
		where: {
			resultId: resultId
		}
	});

	if (!deleteQuery) return res.status(500).send({ success: false, error: "Couldn't delete result" });

	return res.send({ success: true });
};
