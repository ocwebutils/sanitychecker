import { FastifyReply, RawReplyDefaultExpression, RawRequestDefaultExpression, RawServerDefault, RouteGenericInterface } from "fastify";

declare module "fastify" {
	export interface FastifyRequest {
		requestStartTime: bigint;
	}
}

export interface ReplyPayload<Payload extends RouteGenericInterface>
	extends FastifyReply<RawServerDefault, RawRequestDefaultExpression, RawReplyDefaultExpression, Payload> {}
