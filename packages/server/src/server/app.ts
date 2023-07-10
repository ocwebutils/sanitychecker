import Fastify, { FastifyInstance } from "fastify";

import { APIv1Controller } from "./controllers/apiController.v1";
import { OnRequestHook } from "./hooks/onRequest.hook";
import { OnSendHook } from "./hooks/onSend.hook";
import debug from "debug";
import { logger } from "./config";
import connectDatabase from "./database";

export default class App {
	fastify: FastifyInstance;
	logger: debug.Debugger;

	constructor() {
		this.logger = logger.extend("app");
		this.fastify = Fastify({ logger: false, trustProxy: true });

		debug.enable("ocwebutils/sanitychecker:*");

		connectDatabase();
		this.initHooks();
		this.initMiddlewares();
		this.initControllers();
	}

	private initMiddlewares(): void {
		this.logger("Registering middlewares");
		this.fastify.register(import("@fastify/cors"));
	}

	private initControllers(): void {
		this.logger("Registering controllers");
		this.fastify.register(APIv1Controller, { prefix: "/api/v1" });
	}

	private initHooks(): void {
		this.logger("Registering hooks");
		const requestStartTime = Symbol("requestStartTime");
		this.fastify.decorateRequest(requestStartTime, 0);

		this.fastify.addHook("onRequest", OnRequestHook);
		this.fastify.addHook("onSend", OnSendHook);
	}

	listen(port: number): void {
		this.fastify.listen({ port: port }, () => {
			this.logger(`Server is ready on port ${port}`);
		});
	}
}
