<template>
	<section class="flex flex-col pt-4 items-center place-content-center justify-center min-w-fit">
		<div class="px-8 py-6 mt-4 text-left dark:bg-darkgray-700 bg-white shadow-lg rounded-xl">
			<h1 class="text-2xl font-bold text-center">Config Validator</h1>
			<p class="text-center">Please select your CPU and OpenCore version to begin</p>
			<form>
				<div class="mt-4 grid grid-cols-1" id="topForm">
					<FormOptionSelection />
					<div class="relative flex flex-col" v-if="!processing">
						<HeroDropZoneContent @dropFileHandler="dropFileHandler" />
					</div>
					<FormInProgressSvg v-else />
					<div class="divider" />
					<FormFooter />
				</div>
			</form>
		</div>
	</section>
</template>
<script setup lang="ts">
import { validatePlist, parsePlist } from "@/utils/plistHandler";
import { handleForm } from "@/utils/handleForm";
import { useToast } from "vue-toastification";

const processing = ref<boolean>(false);

const toast = useToast();

const dropFileHandler = async (event: File[] | Event) => {
	const eventFile = event instanceof Event ? (event?.target as HTMLInputElement).files : event;
	if (!eventFile || !eventFile.length) return;
	const file = eventFile[0];

	if (!file?.name.endsWith(".plist")) return showErrorNotif("The uploaded file may not be plist file");
	const validationRes = await validatePlist(file),
		parsedRes = await parsePlist(file);

	if (!validationRes || !parsedRes) return showErrorNotif("Error occurred while trying to parse this file. Are you sure it's a valid plist file?");
	processing.value = true;

	const result = await handleForm(parsedRes as Record<string, unknown>, file);
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
