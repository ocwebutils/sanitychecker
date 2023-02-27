<template>
	<div class="flex flex-col sm:flex-row mb-5 sm:space-y-0 space-y-2 w-full">
		<div class="w-full relative inline-block dark:text-white text-black sm:mr-3 md:mr-3">
			<div class="flex flex-row">
				<div class="form-control w-full">
					<label class="label">
						<span class="label-text">CPU</span>
					</label>
					<select
						id="cpu_model"
						class="select select-bordered dark:bg-darkgray-800"
						:class="!supportedOCVersions ? 'max-w-full' : 'max-w-xs'"
						v-model="selectedCPUModel"
					>
						<option value="default" disabled v-if="supportedCPUGenerations">Select CPU Model</option>
						<option value="default" disabled v-else>Loading CPU models...</option>
						<optgroup v-for="(type, key) in supportedCPUGenerations" :label="(key as unknown as string)">
							<option v-for="{ codename, name } in type" :value="codename">{{ name }}</option>
						</optgroup>
					</select>
				</div>
			</div>
		</div>
		<div class="relative inline-block dark:text-white text-black w-full" v-if="supportedOCVersions">
			<div class="form-control">
				<label class="label">
					<span class="label-text">OC Version</span>
				</label>
				<select id="oc_version" class="select select-bordered dark:bg-darkgray-800" v-model="selectedOCVersion">
					<option v-for="version in supportedOCVersions" :value="version">v{{ version }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import { getVariable } from "@/util/utils";
import { axiosInstance } from "@/util/axiosInstance";

export default {
	data() {
		return {
			supportedCPUGenerations: null,
			supportedOCVersions: null,
			selectedCPUModel: "default",
			selectedOCVersion: ref<string | null>(null)
		};
	},
	async mounted() {
		const supportedCPUGenerations = await getSupportedCPUGenerations();
		this.supportedCPUGenerations = supportedCPUGenerations;
		this.restoreSelections();
	},
	methods: {
		getSupportedOCVersions: async function (cpumodel: string) {
			try {
				const { data } = await axiosInstance.get(`/supportedOCVersions/${cpumodel}`);
				if (!data.success) return null;

				const supportedVersions = data.data.supportedVersions;

				this.supportedOCVersions = supportedVersions.sort((a: string, b: string) => b.localeCompare(a));
				this.selectedOCVersion = supportedVersions[0];
			} catch (err) {
				return null;
			}
		},
		restoreSelections: async function () {
			try {
				const lastSelections = getVariable("lastOptions") as { cpuModel: string; ocVersion: string };

				if (!lastSelections) return;

				const { cpuModel, ocVersion } = lastSelections;
				this.selectedCPUModel = cpuModel;
				this.selectedOCVersion = ocVersion;
			} catch (err) {
				return;
			}
		}
	},
	watch: {
		selectedCPUModel: function (newval) {
			this.getSupportedOCVersions(newval);
		}
	}
};

const getSupportedCPUGenerations = async () => {
	try {
		const { data } = await axiosInstance.get("/supportedCPUGenerations");
		if (!data.success) return null;

		let tempArray: { codename: string; name: string }[] = [];
		Object.keys(data.data).map(key => {
			Object.keys(data.data[key]).map(brand => {
				const cpuModel = data.data[key][brand];
				cpuModel.map((cpu: { codename: string; name: string }) => {
					tempArray.push({ codename: cpu.codename, name: `[${brand}] ${cpu.name}` });
				});
			});
			data.data[key] = tempArray;
			tempArray = [];
		});

		return data.data;
	} catch (err) {
		return null;
	}
};
</script>
