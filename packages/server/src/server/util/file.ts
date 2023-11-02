import type { JSONSchema7 } from "json-schema";

export type CPUModelsList = Awaited<ReturnType<typeof getCPUModels>>;
export type SchemaType = Awaited<ReturnType<typeof getSchema>>;

export const getCPUModels = async () => {
		try {
			const { default: cpulist } = await import("@ocwebutils/sc_rules/cpu_list.json", {
				assert: { type: "json" }
			});
			return cpulist;
		} catch (err) {
			return null;
		}
	},
	getOCVersions = async (codename: string) => {
		try {
			const { default: ocVersions } = await import("@ocwebutils/sc_rules/oc_versions.json", {
				assert: { type: "json" }
			});
			return ocVersions.find((item: { codename: string }) => item.codename === codename);
		} catch (err) {
			return null;
		}
	},
	getSchema = async (version: string) => {
		try {
			const { default: schema }: JSONSchema7 = await import(`@ocwebutils/sc_rules/schemas/${version}.schema.json`, {
				assert: { type: "json" }
			});
			return schema;
		} catch (err) {
			return null;
		}
	};

export const getRules = async (version: string, codename: string) => {
	const cpuList: CPUModelsList = await getCPUModels();
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
		const { default: cpuRules } = await import(
			`@ocwebutils/sc_rules/rules/${platform}/${brand}/${version}/${cpuCodename?.replace(/^[^_]*_/, "")}.rules.json`,
			{
				assert: { type: "json" }
			}
		);
		return cpuRules;
	} catch (err) {
		return null;
	}
};
