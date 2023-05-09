import { axiosInstance } from "./axiosInstance";
import { getIdentificator } from "./identificator";
import { isAxiosError } from "axios";
import { setVariable } from "./utils";

export const handleForm = async (file: Record<string, unknown>) => {
		const cpuModel = document.querySelector("#cpu_model") as HTMLSelectElement,
			ocVersion = document.querySelector("#oc_version") as HTMLSelectElement,
			cpuValue = cpuModel.options[cpuModel.selectedIndex].value,
			cpuName = cpuModel.options[cpuModel.selectedIndex].text,
			ocValue = ocVersion.options[ocVersion.selectedIndex].value;

		const uuid = await getIdentificator();

		if (!cpuValue || cpuValue === "default" || !cpuName || !ocValue) return { success: false, error: "Please select CPU model and OpenCore version" };

		try {
			const { data } = await axiosInstance.post("/validateConfig", {
				metadata: {
					uploadedBy: uuid as string,
					ocVersion: ocValue,
					cpuDetails: {
						codename: cpuValue,
						name: cpuName
					}
				},
				config: file
			});

			setVariable("lastOptions", {
				ocVersion: ocValue,
				cpuModel: cpuValue
			});

			return data;
		} catch (error) {
			if (isAxiosError(error)) return { success: false, error: error.response?.data.error ?? "Unknown error" };
		}
	},
	deleteResult = async (e: MouseEvent | HTMLElement) => {
		const target = e instanceof HTMLElement ? e : (e.target as HTMLElement);
		const id = target.id.split("-")[2],
			uploadID = (document.querySelector(`#id-result-${id}`) as HTMLLinkElement).innerText,
			parentElement = target.closest("tr") as HTMLTableRowElement;

		const uuid = await getIdentificator();

		const { data } = await axiosInstance.delete("/result/" + uploadID, {
			headers: {
				"x-user-id": uuid as string
			}
		});
		if (!data.success) return null;

		parentElement.remove();
	};
