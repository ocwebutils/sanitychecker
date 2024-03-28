<template>
	<div class="flex flex-col sm:flex-row mb-5 sm:space-y-0 space-y-2 w-full">
		<div class="w-full relative inline-block dark:text-white text-black" :class="!supportedOCVersions ? '' : 'sm:mr-3 md:mr-3'">
			<div class="flex flex-row">
				<div class="daisy-form-control w-full">
					<label for="cpu_model" class="label">
						<span class="daisy-label-text">CPU model</span>
					</label>
					<select
						id="cpu_model"
						class="daisy-select daisy-select-bordered dark:bg-darkgray-800"
						:class="!supportedOCVersions ? 'max-w-full' : 'max-w-xs'"
						v-model="selectedCPUModel"
					>
						<option value="default" disabled v-if="supportedCPUGenerations">Select CPU Model</option>
						<option value="default" disabled v-else>Loading CPU models...</option>
						<optgroup v-for="(cpuModel, platform) in supportedCPUGenerations" :label="(platform as unknown as string)">
							<option v-for="{ codename, displayName } in cpuModel" :value="codename">{{ displayName }}</option>
						</optgroup>
					</select>
				</div>
			</div>
		</div>
		<div class="relative inline-block dark:text-white text-black w-full" v-if="supportedOCVersions">
			<div class="daisy-form-control">
				<label for="oc_version" class="label">
					<span class="daisy-label-text">OC version</span>
				</label>
				<select id="oc_version" class="daisy-select daisy-select-bordered dark:bg-darkgray-800" v-model="selectedOCVersion">
					<option v-for="version in supportedOCVersions" :value="version">v{{ version }}</option>
				</select>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { getVariable } from "@/utils/helpers";
import type { cpuGenerations, cpuModel } from "@/interfaces/metadata";
import { useCustomFetch } from "@/composables/useCustomFetch";

const supportedCPUGenerations = ref<cpuModel | null>(null),
	supportedOCVersions = ref(null),
	selectedCPUModel = ref("default"),
	selectedOCVersion = ref<string | null>(null);

onMounted(async () => {
	const supportedCPUGenerationsObj = await getSupportedCPUGenerations();
	supportedCPUGenerations.value = supportedCPUGenerationsObj;
	restoreSelections();
});

watch(selectedCPUModel, (newValue: string) => {
	getSupportedOCVersions(newValue);
});

const restoreSelections = () => {
	try {
		const lastSelections = getVariable<{ cpuModel: string; ocVersion: string; includeConfig: boolean }>("lastOptions");

		if (!lastSelections) return;

		const { cpuModel, ocVersion, includeConfig } = lastSelections;
		const includeConfigElement = document.querySelector("#checkboxIncludeConfig") as HTMLInputElement;
		selectedCPUModel.value = cpuModel;
		selectedOCVersion.value = ocVersion;
		includeConfigElement.checked = includeConfig;
	} catch {}
};

const getSupportedOCVersions = async (cpumodel: string) => {
	const { data, error } = await useCustomFetch<{ success: boolean; data?: { supportedVersions: string[] }; error?: string }>(
		`/supportedOCVersions?codename=${cpumodel}`
	);
	if (!data?.value?.success || error?.value?.data) return null;
	const res = data.value.data;

	const supportedVersions = res?.supportedVersions ?? [];
	supportedOCVersions.value = supportedVersions;
	selectedOCVersion.value = supportedVersions[0];
};

const getSupportedCPUGenerations = async () => {
	const { data, error } = await useCustomFetch<{ success: boolean; data?: unknown; error?: string }>("/supportedCPUGenerations");
	if (!data?.value?.success || error?.value?.data) return null;
	const resData = data.value.data;

	const res = resData as cpuGenerations;
	const newRes: cpuModel = {};

	for (const platform in res) {
		const cpuModels = res[platform];
		const updatedCpuModels = Object.keys(cpuModels).flatMap(brand => {
			const models = cpuModels[brand];
			return models.map(({ displayName, codename }) => {
				return {
					displayName: `[${brand}] ${displayName}`,
					codename: codename,
				};
			});
		});
		newRes[platform] = updatedCpuModels;
	}

	return newRes;
};
</script>../../composables/useCustomFetch
