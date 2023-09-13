import { APIv1Controller } from "./controllers/apiController.v1.js";
import Fastify from "fastify";
import type { FastifyInstance } from "fastify";
import { OnRequestHook } from "./hooks/onRequest.hook.js";
import { OnSendHook } from "./hooks/onSend.hook.js";
import connectDatabase from "./database/index.js";
import debug from "debug";
import { logger } from "./config.js";

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
		this.fastify.listen({ port, host: "127.0.0.1" }, () => {
			this.logger(`Server is ready on port ${port}`);
		});
	}
}
