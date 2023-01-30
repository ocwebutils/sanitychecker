import { CPUList } from "../interfaces/list";

export const getCPUModels = async () => {
		try {
			const cpulist = await require("@ocwebutils/sc_rules/cpu_list.json");
			return cpulist;
		} catch (err) {
			return null;
		}
	},
	getOCVersions = async (codename: string) => {
		try {
			const ocVersions = await require("@ocwebutils/sc_rules/oc_versions.json");

			return ocVersions.find((item: { codename: string }) => item.codename === codename);
		} catch (err) {
			return null;
		}
	},
	getSchema = async (version: string) => {
		try {
			const schema = await require(`@ocwebutils/sc_rules/schemas/${version}.schema.json`);
			return schema;
		} catch (err) {
			return null;
		}
	},
	getRules = async (version: string, codename: string) => {
		const cpulist: Record<string, Record<string, CPUList[]>> = await getCPUModels(),
			splitCodename = codename.split("_");

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
	findArray = (obj: Record<string, Record<string, CPUList[]>>, options: { platform: string; brand: string }) => {
		for (const [platform, value] of Object.entries(obj)) {
			if (platform.toLowerCase() !== options.platform) continue;
			for (const [brand, subValue] of Object.entries(value)) {
				if (brand.toLowerCase() === options.brand) return subValue;
			}
		}
	};
