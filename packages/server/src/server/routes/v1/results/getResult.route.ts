import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { deleteOldResults } from "../../../util/deleteOldResults";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

type queryResult = Partial<Pick<Result, "id" | "createdBy" | "expireDate">> | null;
const getResult: Route = {
	url: "/result/:resultId",
	method: "GET",
	handler: async (req: FastifyRequest<{ Params: { resultId: string } }>, res: ReplyPayload<BasicResponse<queryResult>>): Promise<typeof res> => {
		const { resultId } = req.params;

		await deleteOldResults();

		const query = (await context.prisma.results.findFirst({
			where: {
				resultId: resultId
			}
		})) as queryResult;

		if (!query) return res.status(404).send({ success: false, error: "Result doesn't exist in the database" });

		delete query.id;
		delete query.createdBy;
		delete query.expireDate;

		return res.send({ success: true, data: query });
	}
};

export default getResult;
