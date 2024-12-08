import type { FastifyReply, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface } from "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		requestStartTime: bigint;
	}
}

export type ReplyPayload<Payload extends RouteGenericInterface> = FastifyReply<
	RouteGenericInterface,
	RawServerDefault,
	RawRequestDefaultExpression,
	RawReplyDefaultExpression,
	Payload
>;
