import { FastifyInstance } from "fastify";
import { cpuList } from "../routes/list/cpuModels.get";
import { deleteResult } from "../routes/results/result.delete";
import { getResult } from "../routes/results/result.get";
import { ocSchema } from "../routes/schema/[version].get";
import { ocVersionsList } from "../routes/list/ocVersions.get";
import { uploadedResults } from "../routes/user/results.get";
import { validateConfig } from "../routes/results/validate.post";

export async function APIv1Controller(fastify: FastifyInstance) {
	fastify
		.route({
			method: "GET",
			url: "/list/cpumodels",
			handler: cpuList
		})
		.route({
			method: "GET",
			url: "/list/ocversions",
			handler: ocVersionsList
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
			url: "/user/results",
			handler: uploadedResults
		})
		.route({
			method: "POST",
			url: "/result/validate",
			handler: validateConfig
		})
		.route({
			method: "DELETE",
			url: "/result/:resultId",
			handler: deleteResult
		});
}
