import type { UseFetchOptions } from "#app";
import { baseAPIURL } from "@/constants";

export function useCustomFetch<T>(url: string | (() => string), options: UseFetchOptions<T> = {}) {
	return useFetch(url, {
		baseURL: baseAPIURL,
		deep: false,
		...options,
		$fetch: useNuxtApp().$customFetch,
	});
}
