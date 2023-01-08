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
		const cpulist: Record<string, any> = await getCPUModels(),
			splitCodename = codename.split("_");

		let forEachList;

		for (const key of Object.keys(cpulist)) {
			if (key.toLocaleLowerCase() !== splitCodename[0]) continue;
			for (const brand of Object.keys(cpulist[key])) {
				if (brand.toLocaleLowerCase() !== splitCodename[1]) continue;
				forEachList = cpulist[key][brand];
			}
		}

		const cpuModel = forEachList.find((el: any) => {
			if (el.codename === codename) return el;
		});

		if (!cpuModel) return null;

		try {
			const cpuRules = await require(`@ocwebutils/sc_rules/rules/${cpuModel.codename.split("_")[0]}/${cpuModel.codename.split("_")[1]}/${version}/${
				cpuModel.rules
			}`);
			return cpuRules;
		} catch (err) {
			return null;
		}
	};
