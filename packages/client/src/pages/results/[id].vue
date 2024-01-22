<template>
	<div class="flex flex-col items-center place-content-center justify-center lg:px-16">
		<div class="px-4 lg:px-8 py-6 mt-2 text-left dark:bg-darkgray-700 bg-white shadow-lg rounded-xl w-full">
			<div class="text-center">
				<div class="float-right space-x-1">
					<div class="daisy-dropdown daisy-dropdown-bottom daisy-dropdown-end">
						<div tabindex="0" role="button" class="mt-1 daisy-btn daisy-btn-sm daisy-btn-circle daisy-btn-ghost font-medium text-lg hover:text-blue-500 transition-colors">
							<fa-icon icon="fa-solid fa-download" />
						</div>
						<ul tabindex="0" class="p-2 daisy-shadow daisy-menu daisy-dropdown-content z-[1] bg-base-100 rounded-box w-52">
							<li>
								<a href="#" @click.prevent="downloadFile('csv')"><fa-icon icon="fa-solid fa-file-csv" /> Download result</a>
							</li>
							<li v-if="isConfigIncluded">
								<a href="#" @click.prevent="downloadFile('config')"><fa-icon icon="fa-solid fa-file-code" /> Download config</a>
							</li>
						</ul>
					</div>
				</div>
				<div class="flex flex-col text-left">
					<p class="text-2xl font-bold clear-right mb-1">
						Validation results <span class="text-xs">for </span>
						<a href="#" class="text-xs text-blue-600 link-underline hover:link-underline" @click.prevent="copyURL"
							>{{ route.params.id }} <fa-icon icon="fa-solid fa-copy"
						/></a>
					</p>
					<span class="text-lg font-medium">
						<span class="text-blue-600">{{ result.metadata.cpuName.replace(/\[|\]/g, "") }}</span>
						• OpenCore
						<a
							:href="`https://github.com/acidanthera/OpenCorePkg/releases/tag/${result.metadata.ocVersion}`"
							class="text-blue-600 hover:text-blue-700 transition-colors link-underline hover:link-underline"
							>v{{ result.metadata.ocVersion }} <fa-icon icon="fa-solid fa-arrow-up-right-from-square" size="xs" /> </a
					></span>
					<p class="font-medium text-sm">
						Note: The functioning of the config is not guaranteed by this validation, even if everything seems to be in order
					</p>
				</div>
			</div>
			<div class="daisy-divider" />
			<div class="font-medium space-y-4" v-if="!showRawData">
				<div v-for="property in properties">
					<p :id="property" class="mr-4 mb-2 text-lg">{{ property }}
					<template v-for="res in result.results.schemaResults.missingRoot">
						<div v-if="res === property" class="inline">
							<button data-tooltip-target="tooltip-rootMissing" :data-tooltip-placement="isMobile() ? 'bottom' : 'right'" type="button" class="ml-1"><fa-icon
									class="mr-2"
									icon="fa-solid fa-circle-xmark"
									:style="{
										color: 'red'
									}"
								/></button>
									<div
			id="tooltip-rootMissing"
			role="tooltip"
			class="!absolute z-10 invisible inline-block px-3 py-2 text-sm font-medium text-white transition-opacity duration-300 bg-gray-900 rounded-lg shadow-sm opacity-0 tooltip dark:bg-gray-700"
		>
			This root dictionary is missing from your config. Please add it to your config.
			<div class="tooltip-arrow" data-popper-arrow></div>
		</div>
						</div>
					</template>
					</p>
					<template v-for="results in result.results.rulesResults">
						<template v-if="results.path.includes(property)">
							<ResultValueError :ruleOutput="results" v-if="results.ruleSet.type !== 'success'" />
							<ResultValueSuccess :ruleOutput="results" v-else />
						</template>
					</template>
					<template v-for="schemaError in result.results.schemaResults.errorArray">
						<ResultSchemaError :schemaError="schemaError" :ocVersion="result.metadata.ocVersion" v-if="schemaError.path.includes(property)" />
					</template>
				</div>
			</div>
			<div v-else>
				<pre class="bg-gray-100 dark:bg-gray-900 rounded-lg whitespace-pre-wrap p-2">{{ JSON.stringify(result, null, 2) }}</pre>
			</div>
			<div class="daisy-divider" />
			<button class="daisy-btn" @click.prevent="rawData">Show Raw Data</button>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";
import { axiosInstance, baseAPIURL } from "@/utils/axiosInstance";
import { json2csv } from "@/utils/helpers";
import type { JSONSchema7 } from "json-schema";
import { isAxiosError } from "axios";
import { initTooltips } from "flowbite";

const isMobile = () => window.innerWidth <= 760;
const route = useRoute(),
	router = useRouter(),
	showRawData = ref(false),
	toast = useToast();

useHead({
	title: "OpenCore Sanity Checker | Result",
	meta: [
		{
			hid: "description",
			name: "description",
			content: "Result of config validation by OpenCore Sanity Checker"
		},
		{
			property: "og:title",
			content: "OpenCore Sanity Checker"
		},
		{
			property: "og:description",
			content: "Result of config validation by OpenCore Sanity Checker"
		}
	]
});

const getResult = async (id: string) => {
		try {
			const { data } = await axiosInstance.get(`/result/${id}`);
			if (!data.success || !data.data) {
				console.error(data);
				toast.error(data.error, {
					timeout: 5000
				});
				router.push("/");
				return;
			}

			return data.data;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data);
				toast.error(error.response?.data.error, {
					timeout: 5000
				});
				router.push("/");
			}
		}
	},
	getSchema = async (ocVersion: string) => {
		try {
			const { data } = await axiosInstance.get(`/schema?v=${ocVersion}`);
			if (!data.success || !data.data) {
				console.error(data);
				toast.error(data.error, {
					timeout: 5000
				});
				router.push("/");
				return;
			}

			return data.data;
		} catch (error) {
			if (isAxiosError(error)) {
				console.error(error.response?.data);
				toast.error(error.response?.data.error, {
					timeout: 5000
				});
				router.push("/");
			}
		}
	},
	returnProperties = (schema: JSONSchema7) => {
		const properties: string[] = Object.keys(schema.properties as JSONSchema7);
		return properties;
	},
	rawData = (e: MouseEvent) => {
		if (!e?.target) return;
		const target = e.target as HTMLButtonElement;
		showRawData.value = !showRawData.value;
		switch (showRawData.value) {
			case true:
				target.innerText = "Hide Raw Data";
				break;
			case false:
				target.innerText = "Show Raw Data";
				break;
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	},
	downloadFile = (type: "csv" | "config") => {
		switch (type) {
			case "csv":
				{
					const hrefElement = document.createElement("a");
					document.body.appendChild(hrefElement);
					hrefElement.style.display = "none";

					const csv = json2csv(result.results);
					const blob = new Blob([csv], {
						type: "application/octet-stream"
					});
					const url = window.URL.createObjectURL(blob);

					hrefElement.href = url;
					hrefElement.download = "result.csv";
					hrefElement.click();

					window.URL.revokeObjectURL(url);
					hrefElement.remove();
					toast.success("Result has been converted to csv format", {
						timeout: 5000
					});
				}
				break;
			case "config":
				{
					const hrefElement = document.createElement("a");
					document.body.appendChild(hrefElement);
					hrefElement.style.display = "none";

					const url = `${baseAPIURL}/downloadConfig/${result.metadata.configId}`;
					hrefElement.href = url;
					hrefElement.download = "config.plist";
					hrefElement.click();
					hrefElement.remove();
					toast.success("Config has been downloaded", {
						timeout: 5000
					});
				}
				break;
		}
	},
	copyURL = (_: Event) => {
		const permissionName = "clipboard-write" as PermissionName;
		if (!navigator.permissions || !navigator.permissions.query) {
			copyToClipboard();
			return;
		}

		navigator.permissions.query({ name: permissionName }).then(result => {
			if (result.state === ("granted" || "prompt")) copyToClipboard();
		});
	},
	copyToClipboard = () => {
		navigator.clipboard.writeText(document.URL).then(() => {
			toast.success("Link has been copied to the clipboard", {
				timeout: 5000
			});
		});
	},
	result = await getResult(route.params.id as string),
	schema = await getSchema(result.metadata.ocVersion),
	properties = await returnProperties(schema),
	isConfigIncluded = result.metadata.configId;

onMounted(() => {
	initTooltips();
});
</script>
<style>
.daisy-collapse-content a {
	@apply text-blue-500 hover:text-blue-600 transition-colors link-underline hover:link-underline;
}
</style>
