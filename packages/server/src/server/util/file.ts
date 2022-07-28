import { parse } from "json5";
import { readFileSync } from "fs";

export const getCPUModels = async () => {
		try {
			return JSON.parse(readFileSync(`${__dirname}/../rules/cpu_list.json`, "utf8"));
		} catch (err) {
			return null;
		}
	},
	getOCVersions = async () => {
		try {
			return JSON.parse(readFileSync(`${__dirname}/../rules/oc_versions.json`, "utf8"));
		} catch (err) {
			return null;
		}
	},
	getSchema = async (version: string) => {
		const versions = JSON.parse(await readFileSync(`${__dirname}/../rules/oc_versions.json`, "utf8")),
			string = versions.find((element: string) => element === version);

		if (!string) return null;

		try {
			return JSON.parse(await readFileSync(`${__dirname}/../rules/schemas/${string}.schema.json`, "utf8"));
		} catch (err) {
			return null;
		}
	},
	getRules = async (version: string, codename: string) => {
		const cpulist = JSON.parse(await readFileSync(`${__dirname}/../rules/cpu_list.json`, "utf8")),
			versions = JSON.parse(await readFileSync(`${__dirname}/../rules/oc_versions.json`, "utf8")),
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
		const ocVersion = versions.find((element: string) => element === version);

		if (!cpuModel || !ocVersion) return null;

		try {
			return parse(
				await readFileSync(
					`${__dirname}/../rules/rules/${cpuModel.codename.split("_")[0]}/${cpuModel.codename.split("_")[1]}/${ocVersion}/${cpuModel.rules}`,
					"utf8"
				)
			);
		} catch (err) {
			return null;
		}
	};
