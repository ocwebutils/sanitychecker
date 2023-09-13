import type { FastifyReply, FastifyRequest } from "fastify";

export function OnRequestHook(req: FastifyRequest, res: FastifyReply, done: () => void) {
	req.requestStartTime = process.hrtime.bigint();

	if (req.validationError)
		return res.status(400).send({ success: false, error: `${req.validationError.validationContext} ${req.validationError.validation[0].message}` });

	done();
}
