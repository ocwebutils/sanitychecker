import { FastifyReply, FastifyRequest } from "fastify";

export function OnSendHook(res: FastifyRequest, reply: FastifyReply, _: any, done: () => void) {
	const duration = process.hrtime.bigint() - res?.requestStartTime;

	reply.header("x-response-time", `${(Number(duration) / 1e6).toFixed(6)} ms`);

	done();
}
