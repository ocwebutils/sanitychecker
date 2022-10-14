<template>
	<div class="flex flex-col pt-4 items-center place-content-center justify-center">
		<div class="px-8 py-6 mt-4 text-left dark:bg-gray-800 bg-white shadow-lg rounded-xl w-screen max-w-5xl">
			<div class="text-center">
				<h3 class="text-2xl font-bold">Validation results for:</h3>
				<span class="text-lg font-medium">
					<span class="text-blue-600">{{ result.metadata.cpuName.replace(/\[|\]/g, "") }}</span> | OpenCore
					<span class="text-blue-600">v{{ result.metadata.ocVersion }}</span></span
				>
				<p class="font-medium">Note: We don't guarrante working config if everything is shown as correct</p>
			</div>
			<div class="divider" />
			<div class="text-lg font-medium space-y-4" v-if="!showRawData">
				<div v-for="property in properties">
					<h3 :id="property" class="mr-4">{{ property }}</h3>
					<template class="inline" v-for="res in result.results.schemaResults.missingRoot">
						<span v-if="res === property">
							<div class="tooltip" data-tip="This dictionary is missing from your config">
								<font-awesome-icon
									class="mr-2"
									icon="fa-solid fa-circle-xmark"
									:style="{
										color: 'red'
									}"
								/>
							</div>
						</span>
					</template>
					<template v-for="results in result.results.rulesResults">
						<template v-if="results.path.includes(property)">
							<ResultValueError :ruleOutput="results" v-if="results.ruleSet.type !== 'success'" />
							<ResultValueSuccess :ruleOutput="results" v-else />
						</template>
					</template>
					<template v-for="schemaError in result.results.schemaResults.errorArray">
						<ResultSchemaError :schemaError="schemaError" v-if="schemaError.path.includes(property)" />
					</template>
				</div>
			</div>
			<div v-else>
				<pre class="bg-gray-100 dark:bg-gray-900 rounded-lg whitespace-pre-wrap">{{ JSON.stringify(result, null, 2) }}</pre>
			</div>
			<div class="divider" />
			<button class="btn" @click.prevent="rawData">Show Raw Data</button>
			<a href="#" class="float-right font-medium text-lg hover:text-blue-500 transition-colors" @click.prevent="copyURL"
				><font-awesome-icon icon="fa-solid fa-copy" /> Copy Link</a
			>
		</div>
	</div>
</template>
<script setup lang="ts">
import { useToast } from "vue-toastification";
import { axiosInstance } from "@/util/axiosInstance";

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
			const response = await axiosInstance.get(`/result/${id}`);
			if (!response.data.success || !response.data.data) {
				toast.error(response.data.error, {
					timeout: 5000
				});
				router.push("/");
				return;
			}

			return response.data.data;
		} catch (error) {
			toast.error(error.response.data.error, {
				timeout: 5000
			});
			router.push("/");
		}
	},
	getSchema = async (ocVersion: string) => {
		try {
			const response = await axiosInstance.get(`/schema/${ocVersion}`);
			if (!response.data.success || !response.data.data) {
				toast.error(response.data.error, {
					timeout: 5000
				});
				router.push("/");
				return;
			}

			return response.data.data;
		} catch (error) {
			toast.error(error.response.data.error, {
				timeout: 5000
			});
			router.push("/");
		}
	},
	returnProperties = async schema => {
		const properties = [];
		Object.keys(schema.properties).forEach(e => {
			properties.push(e);
		});
		return properties;
	},
	rawData = e => {
		showRawData.value = !showRawData.value;
		switch (showRawData.value) {
			case true:
				e.target.innerText = "Hide Raw Data";
				break;
			case false:
				e.target.innerText = "Show Raw Data";
				break;
		}
		window.scrollTo({ top: 0, behavior: "smooth" });
	},
	copyURL = () => {
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
			toast.success("Copied URL to Clipboard!", {
				timeout: 5000
			});
		});
	},
	result = await getResult(route.params.id as string),
	schema = await getSchema(result.metadata.ocVersion),
	properties = await returnProperties(schema);
</script>
