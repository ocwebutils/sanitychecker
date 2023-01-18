import { FastifyReply, FastifyRequest } from "fastify";

export function OnRequestHook(req: FastifyRequest, _: FastifyReply, done: () => void) {
	req.requestStartTime = process.hrtime.bigint();

	done();
}
