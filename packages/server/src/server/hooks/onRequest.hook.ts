import { FastifyRequest } from "fastify";

declare module "fastify" {
	interface FastifyRequest {
		requestStartTime: bigint;
	}
}

export function OnRequestHook(res: FastifyRequest, _: any, done: () => void) {
	res.requestStartTime = process.hrtime.bigint();

	done();
}
