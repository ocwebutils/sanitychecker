<template>
	<div class="flex flex-col pt-4 items-center place-content-center justify-center min-w-fit">
		<div class="px-8 py-6 mt-4 text-left dark:bg-gray-800 bg-white shadow-lg rounded-xl">
			<h1 class="text-2xl font-bold text-center">Config Validator</h1>
			<p class="text-center">Please select your CPU and OpenCore version to begin</p>
			<form>
				<div class="mt-4 grid grid-cols-1" id="topForm">
					<FormSelection />
					<div class="relative flex flex-col" v-if="!processing">
						<HeroDropZoneContent @dropFileHandler="dropFileHandler" />
					</div>
					<FormInProgress v-else />
					<div class="divider" />
					<FormFooter />
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
			if (!file?.name.endsWith(".plist")) return this.showErrorNotif("This isn't valid plist file!");
			if (file.size > 2 * 1024 * 1024) return this.showErrorNotif("File size is too big!");
			const xmlval = await validateplist(file),
				parsedplist = await parseplist(file);
			if (!xmlval || !parsedplist) return this.showErrorNotif("This isn't valid plist file!");
			this.processing = true;
			const result = await handleForm(parsedplist);
			if (!result.success) {
				this.showErrorNotif(result.error);
				this.processing = false;
				return;
			}
			this.router.push(`/results/${result.data.resultId}`);
		},
		showErrorNotif: async function (message) {
			this.toast.error(message, {
				timeout: 3000
			});
		}
	}
};
</script>
