import { CPUGenerations } from "server/interfaces/routes.interface";
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
	};

export const getRules = async (version: string, codename: string) => {
	const cpuList: CPUGenerations | null = await getCPUModels();
	if (!cpuList) return null;

	const { codename: cpuCodename } = Object.values(cpuList)
		.flatMap(Object.values)
		.flatMap(arr => arr)
		.find((item: { codename: string }) => item.codename === codename);

	const [platform, brand] =
		Object.entries(cpuList)
			.flatMap(([platform, brands]) => Object.entries(brands).map(([brand, models]) => [platform, brand, models]))
			.find(([_, __, models]) => Array.isArray(models) && models.some((model: { codename: string }) => model.codename === codename))
			?.map(m => (typeof m === "string" ? m.toLowerCase() : m)) || [];
	if (!platform || !brand) return null;

	try {
		const cpuRules = await require(`@ocwebutils/sc_rules/rules/${platform}/${brand}/${version}/${cpuCodename?.replace(/^[^_]*_/, "")}.rules.json`);
		return cpuRules;
	} catch (err) {
		return null;
	}
};
