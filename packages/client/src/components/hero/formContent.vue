<template>
	<section class="flex flex-col pt-4 items-center place-content-center justify-center min-w-fit">
		<div class="px-8 py-6 mt-4 text-left dark:bg-darkgray-700 bg-white shadow-lg rounded-xl">
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
	</section>
</template>
<script setup lang="ts">
import { validateplist, parseplist } from "@/util/plistHandler";
import { handleForm } from "@/util/handleForm";
import { useToast } from "vue-toastification";

const processing = ref<boolean>(false);

const toast = useToast();

const dropFileHandler = async (msg: File[] | Event) => {
	const message = msg instanceof Event ? (msg?.target as HTMLInputElement).files : msg;
	if (!message || !message.length) return;
	const file = message[0];

	if (!file?.name.endsWith(".plist")) return showErrorNotif("This isn't valid plist file!");
	if (file.size > 2 * 1024 * 1024) return showErrorNotif("File size is too big!");
	const xmlval = await validateplist(file),
		parsedplist = await parseplist(file);

	if (!xmlval || !parsedplist) return showErrorNotif("This isn't valid plist file!");
	processing.value = true;

	const result = await handleForm(parsedplist as Record<string, unknown>);
	if (!result.success) {
		showErrorNotif(result.error);
		processing.value = false;
		return;
	}

	await navigateTo(`/results/${result.data.resultId}`);
};

const showErrorNotif = (msg: string) => {
	toast.error(msg, {
		timeout: 3000
	});

	return;
};
</script>
