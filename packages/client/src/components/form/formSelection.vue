<template>
	<div class="flex flex-col sm:flex-row mb-5 sm:space-y-0 space-y-2 w-full">
		<div class="w-full relative inline-block dark:text-white text-black sm:mr-3 md:mr-3">
			<div class="flex flex-row">
				<div class="form-control w-full">
					<label class="label">
						<span class="label-text">CPU</span>
					</label>
					<select id="cpu_model" class="select select-bordered max-w-xs" placeholder="CPU model" required>
						<option value="default" selected disabled v-if="cpumodels">Select CPU Model</option>
						<option disabled selected v-if="!cpumodels">Loading CPU models...</option>
						<optgroup v-for="(type, key) in cpumodels" :label="(key as unknown as string)">
							<option v-for="cpu in type" :value="cpu.codename">{{ cpu.name }}</option>
						</optgroup>
					</select>
				</div>
			</div>
		</div>
		<div class="relative inline-block dark:text-white text-black w-full">
			<div class="form-control">
				<label class="label">
					<span class="label-text">OC Version</span>
				</label>
				<select id="oc_version" class="select select-bordered" placeholder="OpenCore version" required>
					<option disabled selected v-if="!ocversions">Loading versions...</option>
					<option v-for="version in ocversions" :value="version">v{{ version }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import axios from "axios";
import { getVariable } from "@/util/localstorage";

export default {
	data() {
		return {
			cpumodels: null,
			ocversions: null
		};
	},
	setup() {
		const config = useRuntimeConfig();
		axios.defaults.baseURL = config.BASE_API_URL;
	},
	async mounted() {
		const cpumodelsres = await getCPUModels(),
			ocversionsres = await getOCVersions();
		this.cpumodels = cpumodelsres;
		this.ocversions = ocversionsres;
	},
	updated() {
		restoreOptions();
	}
};

const getCPUModels = async () => {
		try {
			const response = await axios.get("/list/cpumodels");
			if (!response.data.success) return null;

			let tempArray = [];
			Object.keys(response.data.data).map(key => {
				Object.keys(response.data.data[key]).map(brand => {
					const cpuModel = response.data.data[key][brand];
					cpuModel.map(cpu => {
						tempArray.push({ codename: cpu.codename, name: `[${brand}] ${cpu.name}` });
					});
				});
				response.data.data[key] = tempArray;
				tempArray = [];
			});

			return response.data.data;
		} catch (err) {
			return null;
		}
	},
	getOCVersions = async () => {
		try {
			const response = await axios.get("/list/ocversions");
			if (!response.data.success) return null;

			return response.data.data;
		} catch (err) {
			return null;
		}
	},
	restoreOptions = async () => {
		try {
			const lastOptions = getVariable("lastOptions");

			if (!lastOptions) return;

			const { cpuModel, ocVersion } = lastOptions,
				cpuModelSelector = document.querySelector(`#cpu_model option[value="${cpuModel}"]`) as HTMLOptionElement,
				ocVersionSelector = document.querySelector(`#oc_version option[value="${ocVersion}"]`) as HTMLOptionElement;

			cpuModelSelector.selected = true;
			ocVersionSelector.selected = true;
		} catch (err) {
			return;
		}
	};
</script>
