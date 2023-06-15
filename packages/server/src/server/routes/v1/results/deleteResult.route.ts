import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const deleteResult: Route = {
	url: "/result/:resultId",
	method: "DELETE",
	handler: async (
		req: FastifyRequest<{ Headers: { "x-user-id": string }; Params: { resultId: string } }>,
		res: ReplyPayload<BasicResponse>
	): Promise<typeof res> => {
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
	}
};

export default deleteResult;
