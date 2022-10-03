import { FastifyInstance } from "fastify";
import { deleteResult } from "../routes/results/result.delete";
import { getPackageVersions } from "../routes/getPackageVersions.get";
import { getResult } from "../routes/results/result.get";
import { ocSchema } from "../routes/schema/[version].get";
import { supportedCPUGenerations } from "../routes/list/supportedCPUGenerations.get";
import { supportedOCVersions } from "../routes/list/supportedOCVersions.get";
import { uploadedResults } from "../routes/user/uploadedResults.get";
import { validateConfig } from "../routes/results/validate.post";

export async function APIv1Controller(fastify: FastifyInstance) {
	fastify
		.route({
			method: "GET",
			url: "/packageVersions",
			handler: getPackageVersions
		})
		.route({
			method: "GET",
			url: "/supportedCPUGenerations",
			handler: supportedCPUGenerations
		})
		.route({
			method: "GET",
			url: "/supportedOCVersions",
			handler: supportedOCVersions
		})
		.route({
			method: "GET",
			url: "/schema/:version",
			handler: ocSchema
		})
		.route({
			method: "GET",
			url: "/result/:resultId",
			handler: getResult
		})
		.route({
			method: "GET",
			url: "/user/uploadedResults",
			handler: uploadedResults
		})
		.route({
			method: "POST",
			url: "/validateConfig",
			handler: validateConfig
		})
		.route({
			method: "DELETE",
			url: "/result/:resultId",
			handler: deleteResult
		});
}
