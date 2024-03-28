<template>
	<dialog id="uploadedFilesModal" class="daisy-modal">
		<form method="dialog" class="daisy-modal-box max-w-3xl">
			<button for="uploadedFilesModal" class="daisy-btn daisy-btn-sm daisy-btn-circle daisy-btn-ghost absolute right-2 top-2">✕</button>
			<p class="font-bold text-lg">Your uploaded results</p>
			<p>Uploaded results are expired after countdown ends or you can manually remove them from the database.</p>
			<div class="mt-3">
				<div class="overflow-x-auto">
					<table class="daisy-table w-full max-h-20">
						<thead>
							<tr>
								<th scope="col">#</th>
								<th scope="col">ID</th>
								<th scope="col">Remaining time</th>
								<th scope="col">Action</th>
							</tr>
						</thead>
						<tbody v-if="uploads">
							<tr v-for="(result, index) in uploads">
								<th>{{ index + 1 }}</th>
								<th>
									<div class="daisy-tooltip" :data-tip="`${result.metadata.cpuName} - v${result.metadata.ocVersion}`">
										<NuxtLink class="hover:underline" :href="`/results/${result.resultId}`" :id="`id-result-${index}`">{{
											result.resultId
										}}</NuxtLink>
									</div>
								</th>
								<th>
									<span class="daisy-countdown font-mono space-x-2">
										<span class="days" :style="`--value: ${getDiff(date, result.expireDate).days}`"></span>d
										<span class="hours" :style="`--value: ${getDiff(date, result.expireDate).hours}`"></span>h
										<span class="minutes" :style="`--value: ${getDiff(date, result.expireDate).minutes}`"></span>m
									</span>
								</th>
								<th>
									<button class="daisy-btn daisy-btn-error daisy-btn-sm" :id="`delete-result-${index}`" @click.prevent="executeResultDeletion">Delete</button>
								</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</form>
		<form method="dialog" class="daisy-modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</template>
<script setup lang="ts">
import { getIdentificator } from "@/utils/identificator";
import { Countdown } from "@/class/countdown";
import { deleteResult } from "@/utils/handleForm";
import { useCustomFetch } from "@/composables/useCustomFetch";

const { $toast: toast } = useNuxtApp();
const uploads = await getUploadList();
const date = Date.now();

onMounted(() => {
	for (const countdownElement of document.querySelectorAll<HTMLSpanElement>(".countdown")) {
		const timer = new Countdown(countdownElement);
		timer.start();
	}
});

const getDiff = (start: number, end: number) => {
	const diffms = Math.abs(end - start) / 1000;
	const days = Math.floor(diffms / 86400);
	const hours = Math.floor((diffms % 86400) / 3600);
	const minutes = Math.floor((diffms % 3600) / 60);
	return { days, hours, minutes };
};

const executeResultDeletion = async (e: MouseEvent) => {
	await deleteResult(e);
};

async function getUploadList() {
	const uuid = (await getIdentificator()) as string;
	const { data, error } = await useCustomFetch<{ success: boolean; data?: unknown; error?: string }>("/user/uploadedResults", {
		headers: {
			"x-user-id": uuid,
		},
	});

	if (!data?.value?.success || error?.value?.data) {
		console.error(data?.value?.error ?? error?.value?.data);
		toast.error("Error occured. Check console for errors");

		return;
	}

	return data.value.data;
}
</script>
<style>
.dark table,
.dark th,
.dark td,
.dark tr {
	@apply bg-darkgray-800 rounded-lg;
}
</style>../../composables/useCustomFetch
