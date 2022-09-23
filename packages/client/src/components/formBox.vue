<template>
	<div class="flex flex-col pt-4 items-center place-content-center justify-center">
		<div class="px-8 py-6 mt-4 text-left dark:bg-gray-800 bg-white shadow-lg rounded-xl">
			<h3 class="text-2xl font-bold text-center">Welcome!</h3>
			<h1 class="text-lg text-center">Please select your CPU and OpenCore version to begin</h1>
			<form>
				<div class="mt-4 grid grid-cols-1" id="topForm">
					<FormSelection />
					<div class="relative flex flex-col" v-if="!processing">
						<dropZone #default="{ dropZoneActive }" @fileDropped="dropFileHandler">
							<div class="flex justify-center items-center w-full">
								<label
									for="dropzone-file"
									class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 cursor-pointer dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
									v-bind:class="
										dropZoneActive ? 'border-solid dark:bg-bray-800 dark:border-gray-500 dark:bg-gray-600' : 'hover:border-solid border-dashed'
									"
								>
									<div class="flex flex-col justify-center items-center pt-5 pb-6">
										<font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="mb-3 w-10 h-10 text-gray-400" />
										<p class="mb-2 text-sm text-gray-500 dark:text-gray-400" v-if="dropZoneActive">
											<span class="font-semibold">Drop your config here</span>
										</p>
										<p class="mb-2 text-sm text-gray-500 dark:text-gray-400" v-else>
											<span class="font-semibold">Click to upload</span> or drag and drop
										</p>
										<p class="text-xs text-gray-500 dark:text-gray-400">.PLIST (MAX. 2MB)</p>
									</div>
									<input id="dropzone-file" type="file" @change="dropFileHandler" class="hidden" accept=".plist" />
								</label>
							</div>
						</dropZone>
					</div>
					<FormValidating v-else />
					<div class="divider" />
					<FormOptions />
				</div>
			</form>
		</div>
	</div>
</template>
<script lang="ts">
import { validateplist, parseplist } from "@/util/plistHandler";
import { handleForm } from "@/util/handleForm";
import { useToast } from "vue-toastification";

export default {
	data() {
		return {
			processing: false
		};
	},
	setup() {
		const router = useRouter();
		const toast = useToast();

		return { router, toast };
	},
	methods: {
		dropFileHandler: async function (msg) {
			const file = msg[0] ?? msg.target?.files[0];
			if (!file?.name.endsWith(".plist")) return this.errorHandler("This isn't valid plist file!");
			if (file.size > 2 * 1024 * 1024) return this.errorHandler("File size is too big!");
			const xmlval = await validateplist(file);
			if (!xmlval) return this.errorHandler("This isn't valid plist file!");
			const parsedplist = await parseplist(file);
			if (!parsedplist) return this.errorHandler("This isn't valid plist file!");
			this.processing = true;
			const result = await handleForm(parsedplist);
			if (!result.success) {
				this.toast.error(result.error, {
					timeout: 5000
				});
				this.processing = false;
				return;
			}
			this.router.push(`/results/${result.data.resultId}`);
		},
		errorHandler: async function (message) {
			this.toast.error(message, {
				timeout: 3000
			});
		}
	},
	head: {
		script: [
			{
				src: "/assets/js/plist.min.js?v=3.0.7"
			}
		]
	}
};
</script>
