import Fastify, { FastifyInstance } from "fastify";

import { APIv1Controller } from "./controllers/apiController.v1";
import debug from "debug";
import { logger } from "./config";

export default class App {
	fastify: FastifyInstance;
	logger: debug.Debugger;

	constructor() {
		this.logger = logger.extend("app");
		this.fastify = Fastify({ logger: false, trustProxy: true });

		debug.enable("ocSanityChecker:*");

		this.initMiddlewares();
		this.initControllers();
	}

	private initMiddlewares(): void {
		this.logger("Initializing middlewares");
		this.fastify.register(import("@fastify/cors")).register(import("@fastify/compress"));
		/*this.fastify.register(((err, _, res, next) => {
			if (err.code !== "EBADCSRFTOKEN") return next(err);
			return res.status(403).json({
				success: false,
				error: { message: "CSRF Token is invalid." }
			});
		}) as ErrorRequestHandler);*/
	}

	private initControllers(): void {
		this.logger("Registering controllers");
		this.fastify.register(APIv1Controller, { prefix: "/api/v1" });
	}

	listen(port: number): void {
		this.fastify.listen({ port: port, host: "0.0.0.0" }, () => {
			this.logger(`Server is ready on port ${port}`);
		});
	}
}
