<template>
	<div><LazyFormUploadedFilesModal /></div>
	<div class="flex flex-row items-center place-items-center justify-center">
		<label class="daisy-btn" onclick="uploadedFilesModal.showModal()">Show Uploaded Results</label>
		<div class="daisy-divider daisy-divider-horizontal"></div>
		<label class="relative lg:inline-flex items-center cursor-pointer">
			<input id="checkboxIncludeConfig" type="checkbox" class="sr-only peer" />
			<div
				class="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
			></div>
			<span class="ms-3 text-sm font-medium text-gray-900 dark:text-gray-300">Include config</span
			><button id="tooltipBtn" aria-label="Include config information" data-tooltip-target="tooltip-includeConfig" type="button" class="ml-1"><fa-icon icon="fa-solid fa-circle-info" /></button>
		</label>
		<div
			id="tooltip-includeConfig"
			role="tooltip"
			class="absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
		>
			This functionality is in beta and does NOT censor SMBIOS values at this moment.
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
	</div>
</template>
<script setup lang="ts">
import { initTooltips } from "flowbite";
useHead({
	script: [
		{
			src: "https://cdn.jsdelivr.net/gh/nuxodin/dialog-polyfill@v1.4.1/dialog.min.js",
			type: "module",
		},
	],
});

onMounted(() => {
	initTooltips();
});
</script>
