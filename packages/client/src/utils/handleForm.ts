import { readFileAsBase64, setVariable } from "./helpers";

import { axiosInstance } from "./axiosInstance";
import { getIdentificator } from "./identificator";
import { isAxiosError } from "axios";
import type { requestBody } from "~/interfaces/metadata";

export const handleForm = async (file: Record<string, unknown>, plistBlob: File) => {
		const cpuModelSelect = document.querySelector("#cpu_model") as HTMLSelectElement,
			ocVersionSelect = document.querySelector("#oc_version") as HTMLSelectElement,
			includeConfigCheckBox = document.querySelector("#checkboxIncludeConfig") as HTMLInputElement,
			cpuModel = cpuModelSelect.options[cpuModelSelect.selectedIndex]?.value,
			cpuName = cpuModelSelect.options[cpuModelSelect.selectedIndex]?.text,
			ocVersion = ocVersionSelect?.options[ocVersionSelect.selectedIndex]?.value,
			includeConfig = false;

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
					name: cpuName
				}
			},
			configBody: {
				data: file
			}
		};

		if (plistBlob) requestBody.configBody.buffer = (await readFileAsBase64(plistBlob)).split(",")[1];

		try {
			const { data } = await axiosInstance.post("/validateConfig", requestBody);

			setVariable("lastOptions", {
				ocVersion,
				cpuModel,
				includeConfig
			});

			return data;
		} catch (error) {
			if (isAxiosError(error)) return { success: false, error: error.response?.data.error ?? "Unknown error" };
		}
	},
	deleteResult = async (event: MouseEvent | HTMLElement) => {
		const target = event instanceof HTMLElement ? event : (event.target as HTMLElement);
		const id = target.id.split("-")[2],
			uploadID = (document.querySelector(`#id-result-${id}`) as HTMLLinkElement).innerText,
			parentElement = target.closest("tr") as HTMLTableRowElement;

		const uuid = await getIdentificator();

		const { data } = await axiosInstance.delete("/result/" + uploadID, {
			headers: {
				"x-user-id": uuid as string
			}
		});
		if (!data.success) return;

		parentElement.remove();
	};
