import axios from "axios";
import { getIdentificator } from "./identificator";
import { setVariable } from "./localstorage";

export const handleForm = async file => {
		const config = useRuntimeConfig();
		axios.defaults.baseURL = config.BASE_API_URL;
		axios.defaults.headers.common["Access-Control-Allow-Origin"] = "*";

		const cpuModel = document.querySelector("#cpu_model") as HTMLSelectElement,
			ocVersion = document.querySelector("#oc_version") as HTMLSelectElement,
			cpuValue = cpuModel.options[cpuModel.selectedIndex].value,
			cpuName = cpuModel.options[cpuModel.selectedIndex].text,
			ocValue = ocVersion.options[ocVersion.selectedIndex].value;

		if (!cpuValue || cpuValue === "default" || !cpuName || !ocValue) return { success: false, error: "Please select CPU model and OpenCore version" };

		try {
			const response = await axios.post("/validateConfig", {
				metadata: {
					uploadedBy: getIdentificator(),
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

			return response.data;
		} catch (error) {
			return { success: false, error: error.response?.data?.error ?? "Unknown error" };
		}
	},
	deleteResult = async e => {
		const id = e.target.id.split("-")[2],
			uploadID = (document.querySelector(`#id-result-${id}`) as HTMLLinkElement).innerText,
			parentElement = e.target.closest("tr");

		const response = await axios.delete("/result/" + uploadID, {
			headers: {
				"x-user-id": getIdentificator()
			}
		});
		if (!response.data.success) return null;

		parentElement.remove();
	};
