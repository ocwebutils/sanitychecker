import { FastifyRequest } from "fastify";

import { Result } from "server/interfaces/metadata.interface";
import { context } from "../../../database";
import { deleteOldResults } from "../../../util/deleteOldResults";
import { uuidValidate } from "../../../util/uuidValidate";
import { BasicResponse, Route } from "server/interfaces/routes.interface";
import { ReplyPayload } from "server/interfaces/fastify.interface";

const uploadedResults: Route = {
	url: "/user/uploadedResults",
	method: "GET",
	handler: async (req: FastifyRequest<{ Headers: { "x-user-id": string } }>, res: ReplyPayload<BasicResponse<Result[]>>): Promise<typeof res> => {
		const user = req.headers["x-user-id"];

		if (!user || !uuidValidate(user)) return res.status(403).send({ success: false, error: "No 'user-id' header is provided" });

		await deleteOldResults();

		const query = (await context.prisma.results.findMany({
			where: {
				createdBy: user
			}
		})) as Result[];

		if (!query) return res.status(404).send({ success: false, error: "Error occurred. Server couldn't return a result" });

		const newQuery: Result[] = query.map(({ results, ...item }: Result) => item);

		return res.send({ success: true, data: newQuery });
	}
};

export default uploadedResults;
