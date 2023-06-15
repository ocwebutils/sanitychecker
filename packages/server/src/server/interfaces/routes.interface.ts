import { RouteGenericInterface } from "fastify/types/route";
import { CPUList, Results } from "./metadata.interface";

export type Route = {
	url: string;
	method: string;
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
