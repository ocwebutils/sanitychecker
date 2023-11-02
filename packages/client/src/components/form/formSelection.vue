<template>
	<div class="flex flex-col sm:flex-row mb-5 sm:space-y-0 space-y-2 w-full">
		<div class="w-full relative inline-block dark:text-white text-black" :class="!supportedOCVersions ? '' : 'sm:mr-3 md:mr-3'">
			<div class="flex flex-row">
				<div class="form-control w-full">
					<label for="cpu_model" class="label">
						<span class="label-text">CPU model</span>
					</label>
					<select
						id="cpu_model"
						class="select select-bordered dark:bg-darkgray-800"
						:class="!supportedOCVersions ? 'max-w-full' : 'max-w-xs'"
						v-model="selectedCPUModel"
					>
						<option value="default" disabled v-if="supportedCPUGenerations">Select CPU Model</option>
						<option value="default" disabled v-else>Loading CPU models...</option>
						<optgroup v-for="(cpuModel, platform) in supportedCPUGenerations" :label="platform">
							<option v-for="{ codename, displayName } in cpuModel" :value="codename">{{ displayName }}</option>
						</optgroup>
					</select>
				</div>
			</div>
		</div>
		<div class="relative inline-block dark:text-white text-black w-full" v-if="supportedOCVersions">
			<div class="form-control">
				<label for="oc_version" class="label">
					<span class="label-text">OC version</span>
				</label>
				<select id="oc_version" class="select select-bordered dark:bg-darkgray-800" v-model="selectedOCVersion">
					<option v-for="version in supportedOCVersions" :value="version">v{{ version }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getVariable } from "@/util/utils";
import { axiosInstance } from "@/util/axiosInstance";

const supportedCPUGenerations = ref<Record<string, { codename: string; displayName: string }[]> | null>(null),
	supportedOCVersions = ref(null),
	selectedCPUModel = ref("default"),
	selectedOCVersion = ref<string | null>(null);

onMounted(async () => {
	const supportedCPUGenerationsObj = await getSupportedCPUGenerations();
	supportedCPUGenerations.value = supportedCPUGenerationsObj;
	restoreSelections();
});

watch(selectedCPUModel, function (newValue: string) {
	getSupportedOCVersions(newValue);
});

const restoreSelections = () => {
	try {
		const lastSelections = getVariable("lastOptions") as { cpuModel: string; ocVersion: string; includeConfig: boolean };

		if (!lastSelections) return;

		const { cpuModel, ocVersion, includeConfig } = lastSelections;
		const includeConfigElement = document.querySelector("#checkboxIncludeConfig") as HTMLInputElement;
		selectedCPUModel.value = cpuModel;
		selectedOCVersion.value = ocVersion;
		includeConfigElement.checked = includeConfig;
	} catch (err) {
		return;
	}
};

const getSupportedOCVersions = async (cpumodel: string) => {
	try {
		const { data } = await axiosInstance.get(`/supportedOCVersions?codename=${cpumodel}`);
		if (!data.success) return null;

		const supportedVersions = data.data.supportedVersions;

		supportedOCVersions.value = supportedVersions;
		selectedOCVersion.value = supportedVersions[0];
	} catch (err) {
		return null;
	}
};

const getSupportedCPUGenerations = async () => {
	try {
		const { data } = await axiosInstance.get("/supportedCPUGenerations");
		if (!data.success) return null;

		let tempArray: { codename: string; displayName: string }[] = [];
		Object.keys(data.data).forEach(key => {
			Object.keys(data.data[key]).forEach(brand => {
				const cpuModel: { codename: string; displayName: string }[] = data.data[key][brand];
				cpuModel.forEach((cpu: { codename: string; displayName: string }) => {
					tempArray.push({ displayName: `[${brand}] ${cpu.displayName}`, codename: cpu.codename });
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
