import type { CPUList, Results } from "./metadata.interface.js";

import type { RouteGenericInterface } from "fastify/types/route.js";

export type Route = {
	url: string;
	method: string;
	schema?: Record<string, unknown>;
	attachValidation?: boolean;
	// biome-ignore lint/complexity/noBannedTypes: <explanation>
	handler: Function;
};

export type BasicResponse<T = void> = RouteGenericInterface & {
	Reply: Response<T>;
};
type Response<T> = SuccessfulResponse<T> | UnsuccessfulResponse;

interface SuccessfulResponse<T> {
	success: true;
	data?: T;
}

interface UnsuccessfulResponse {
	success: false;
	error: string;
}

export type OpenCoreVersions = {
	supportedVersions: string[];
};

export type CPUGenerations = {
	[key: string]: {
		[key: string]: CPUList[];
	};
};

export type packageVersions = {
	rulesVersion: string;
	apiVersion: string;
};

export type validateResult = {
	results: Results;
	resultId: string;
};
