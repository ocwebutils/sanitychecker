import { CPUGenerations } from "server/interfaces/routes.interface";
import { CPUList } from "../interfaces/metadata.interface";
import { JSONSchema7 } from "json-schema";
export const getCPUModels = async () => {
		try {
			const cpulist: CPUGenerations = await require("@ocwebutils/sc_rules/cpu_list.json");
			return cpulist;
		} catch (err) {
			return null;
		}
	},
	getOCVersions = async (codename: string) => {
		try {
			const ocVersions: { codename: string; supportedVersions: string[] }[] = await require("@ocwebutils/sc_rules/oc_versions.json");
			return ocVersions.find(item => item.codename === codename);
		} catch (err) {
			return null;
		}
	},
	getSchema = async (version: string) => {
		try {
			const schema: JSONSchema7 = await require(`@ocwebutils/sc_rules/schemas/${version}.schema.json`);
			return schema;
		} catch (err) {
			return null;
		}
	},
	getRules = async (version: string, codename: string) => {
		const cpulist: CPUGenerations | null = await getCPUModels(),
			splitCodename = codename.split("_");

		if (!cpulist) return null;

		const forEachList = findArray(cpulist, { platform: splitCodename[0], brand: splitCodename[1] });

		if (!forEachList) return null;

		const cpuModel = forEachList.find((item: { codename: string }) => item.codename === codename);

		if (!cpuModel) return null;

		try {
			const cpuRules = await require(`@ocwebutils/sc_rules/rules/${cpuModel.codename.split("_")[0]}/${cpuModel.codename.split("_")[1]}/${version}/${
				cpuModel.rules
			}`);
			return cpuRules;
		} catch (err) {
			return null;
		}
	},
	findArray = (obj: CPUGenerations, options: { platform: string; brand: string }) => {
		for (const [platform, value] of Object.entries(obj)) {
			if (platform.toLowerCase() !== options.platform) continue;
			for (const [brand, subValue] of Object.entries(value)) {
				if (brand.toLowerCase() === options.brand) return subValue;
			}
		}
	};
