import { FastifyInstance } from "fastify";
import { readdirSync } from "node:fs";
import { join } from "node:path";
import { logger } from "../config";

function walk(dir: string): string[] {
	return readdirSync(dir, { withFileTypes: true }).flatMap(file => (file.isDirectory() ? walk(join(dir, file.name)) : join(dir, file.name)));
}

export async function APIv1Controller(fastify: FastifyInstance) {
	const routeFiles = walk(join(__dirname, "..", "routes", "v1"));

	for (const file of routeFiles) {
		const { default: route } = await import(file);
		logger.extend("APIv1Controller")("Registering route: %o %s", route.method, route.url);
		fastify.route(route);
	}
}
