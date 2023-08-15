<template>
	<dialog id="uploadedFilesModal" class="modal">
		<form method="dialog" class="modal-box max-w-3xl">
			<button for="uploadedFilesModal" class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
			<p class="font-bold text-lg">Your uploaded results</p>
			<p>Uploaded results are expired after countdown ends or you can manually remove them from the database.</p>
			<div class="mt-3">
				<div class="overflow-x-auto">
					<table class="table w-full max-h-20">
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
									<div class="tooltip" :data-tip="`${result.metadata.cpuName} - v${result.metadata.ocVersion}`">
										<NuxtLink class="hover:underline" :href="'/results/' + result.resultId" :id="'id-result-' + index">{{
											result.resultId
										}}</NuxtLink>
									</div>
								</th>
								<th>
									<span class="countdown font-mono space-x-2">
										<span class="days" :style="'--value:' + getDiff(date, result.expireDate)[0]"></span>d
										<span class="hours" :style="'--value:' + getDiff(date, result.expireDate)[1]"></span>h
										<span class="minutes" :style="'--value:' + getDiff(date, result.expireDate)[2]"></span>m
									</span>
								</th>
								<th>
									<button class="btn btn-error btn-sm" :id="'delete-result-' + index" @click.prevent="executeResultDeletion">Delete</button>
								</th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
		</form>
		<form method="dialog" class="modal-backdrop">
			<button>close</button>
		</form>
	</dialog>
</template>
<script setup lang="ts">
import { getIdentificator } from "@/util/identificator";
import { Countdown } from "@/class/countdown";
import { deleteResult } from "@/util/handleForm";
import { axiosInstance } from "@/util/axiosInstance";
import { useToast } from "vue-toastification";
import { isAxiosError } from "axios";

const uploads = await getUploadList();
const date = Date.now();
const toast = useToast();

onMounted(() => {
	document.querySelectorAll(".countdown").forEach(e => {
		const timer = new Countdown(e as HTMLSpanElement);
		timer.start();
	});
});

const getDiff = (start: number, end: number) => {
	const diffms = Math.abs(end - start) / 1000;
	const days = Math.floor(diffms / 86400);
	const hours = Math.floor((diffms % 86400) / 3600);
	const minutes = Math.floor((diffms % 3600) / 60);
	return [days, hours, minutes];
};

const executeResultDeletion = async (e: MouseEvent) => {
	await deleteResult(e);
};

async function getUploadList() {
	const uuid = (await getIdentificator()) as string;
	try {
		const { data } = await axiosInstance.get("/user/uploadedResults", {
			headers: {
				"x-user-id": uuid
			}
		});
		if (!data.success) {
			console.error(data);
			toast.error("Error occured. Check console for errors", {
				timeout: 5000
			});

			return;
		}

		return data.data;
	} catch (error) {
		if (isAxiosError(error)) {
			console.error(error);
			toast.error(error.code === "ERR_NETWORK" ? "Backend is offline. Try again later" : "Error occured", {
				timeout: 5000
			});

			return;
		}
	}
}
</script>
<style>
.dark table,
.dark th,
.dark td,
.dark tr {
	@apply bg-darkgray-800 rounded-lg;
}
</style>
