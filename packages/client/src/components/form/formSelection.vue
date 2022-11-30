<template>
	<div class="flex flex-col sm:flex-row mb-5 sm:space-y-0 space-y-2 w-full">
		<div class="w-full relative inline-block dark:text-white text-black sm:mr-3 md:mr-3">
			<div class="flex flex-row">
				<div class="form-control w-full">
					<label class="label">
						<span class="label-text">CPU</span>
					</label>
					<select id="cpu_model" class="select select-bordered max-w-xs" placeholder="CPU model" required>
						<option value="default" selected disabled v-if="supportedCPUGenerations">Select CPU Model</option>
						<option disabled selected v-else>Loading CPU models...</option>
						<optgroup v-for="(type, key) in supportedCPUGenerations" :label="(key as unknown as string)">
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
					<option disabled selected v-if="!supportedOCVersions">Loading versions...</option>
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
			supportedOCVersions: null
		};
	},
	async mounted() {
		const supportedCPUGenerations = await getSupportedCPUGenerations(),
			supportedOCVersions = await getSupportedOCVersions();
		this.supportedCPUGenerations = supportedCPUGenerations;
		this.supportedOCVersions = supportedOCVersions;
	},
	updated() {
		restoreOptions();
	}
};

const getSupportedCPUGenerations = async () => {
		try {
			const response = await axiosInstance.get("/supportedCPUGenerations");
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
	getSupportedOCVersions = async () => {
		try {
			const response = await axiosInstance.get("/supportedOCVersions");
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
