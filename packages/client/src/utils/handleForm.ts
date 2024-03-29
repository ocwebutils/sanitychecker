import { useCustomFetch } from "@/composables/useCustomFetch";
import { readFileAsBase64, setVariable } from "./helpers";

import { getIdentificator } from "./identificator";
import type { requestBody } from "@/interfaces/metadata";

export const handleForm = async (file: Record<string, unknown>, plistBlob: File) => {
		const cpuModelSelect = document.querySelector("#cpu_model") as HTMLSelectElement,
			ocVersionSelect = document.querySelector("#oc_version") as HTMLSelectElement,
			includeConfigCheckBox = document.querySelector("#checkboxIncludeConfig") as HTMLInputElement,
			cpuModel = cpuModelSelect.options[cpuModelSelect.selectedIndex]?.value,
			cpuName = cpuModelSelect.options[cpuModelSelect.selectedIndex]?.text,
			ocVersion = ocVersionSelect?.options[ocVersionSelect.selectedIndex]?.value,
			includeConfig = includeConfigCheckBox?.checked ?? false;

		const uuid = await getIdentificator();

		if (!cpuModel || cpuModel === "default" || !cpuName || !ocVersion)
			return { success: false, error: "Please select CPU model and OpenCore version" };

		const requestBody: requestBody = {
			metadata: {
				uploadedBy: uuid as string,
				ocVersion,
				includeConfig,
				cpuDetails: {
					codename: cpuModel,
					name: cpuName,
				},
			},
			configBody: {
				data: file,
			},
		};

		if (plistBlob) requestBody.configBody.buffer = (await readFileAsBase64(plistBlob)).split(",")[1];

		const { data, error } = await useCustomFetch<{ success: boolean; data?: unknown; error?: string }>("/validateConfig", {
			method: "POST",
			body: requestBody,
		});
		if (!data?.value?.success || error?.value?.data)
			return { success: false, error: data?.value?.error ?? error?.value?.data?.error ?? "Unknown error" };

		setVariable("lastOptions", {
			ocVersion,
			cpuModel,
			includeConfig,
		});

		return data?.value;
	},
	deleteResult = async (event: MouseEvent | HTMLElement) => {
		const target = event instanceof HTMLElement ? event : (event.target as HTMLElement);
		const id = target.id.split("-")[2],
			uploadID = (document.querySelector(`#id-result-${id}`) as HTMLLinkElement).innerText,
			parentElement = target.closest("tr") as HTMLTableRowElement;

		const uuid = await getIdentificator();
		const { data, error } = await useCustomFetch<{ success: boolean; data: unknown; error?: string }>(`/result/${uploadID}`, {
			method: "DELETE",
			headers: {
				"x-user-id": uuid as string,
			},
		});
		if (!data?.value?.success || error?.value?.data) return;

		parentElement.remove();
	};
