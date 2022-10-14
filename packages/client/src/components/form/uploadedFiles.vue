<template>
	<input type="checkbox" id="uploadedFilesModal" class="modal-toggle" />
	<label for="uploadedFilesModal" class="modal cursor-pointer">
		<label for="" class="modal-box relative max-w-3xl">
			<h3 class="font-bold text-lg">Your uploaded results</h3>
			<p>Uploaded results are expired after countdown ends or you can manually remove them from the database.</p>
			<div class="mt-3">
				<div class="overflow-x-auto">
					<table class="table table-compact w-full max-h-20">
						<thead>
							<tr>
								<th></th>
								<th>ID</th>
								<th>Remaining time</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody v-if="uploads">
							<tr v-for="(result, index) in uploads">
								<th>{{ index + 1 }}</th>
								<th>
									<NuxtLink class="hover:underline" :href="'/results/' + result.resultId" :id="'id-result-' + index">{{ result.resultId }}</NuxtLink>
								</th>
								<th>
									<span class="countdown font-mono space-x-2">
										<span class="hours" :style="'--value:' + getDiff(date, result.expireDate)[0]"></span>h
										<span class="minutes" :style="'--value:' + getDiff(date, result.expireDate)[1]"></span>m
									</span>
								</th>
								<th><button class="btn btn-error btn-sm" :id="'delete-result-' + index" @click.prevent="deleteResult">Delete</button></th>
							</tr>
						</tbody>
					</table>
				</div>
			</div>
			<div class="modal-action">
				<label for="uploadedFilesModal" class="btn">Close</label>
			</div>
		</label>
	</label>
</template>
<script lang="ts">
import { createIdentificator, getIdentificator } from "@/util/identificator";
import { Countdown } from "@/class/countdown";
import { deleteResult } from "@/util/handleForm";
import { axiosInstance } from "@/util/axiosInstance";

export default {
	data() {
		return {
			date: null
		};
	},
	async setup() {
		const uploads = await getUploadList(),
			date = Date.now();

		return { uploads, date };
	},
	mounted() {
		document.querySelectorAll(".countdown").forEach(e => {
			const timer = new Countdown(e);
			timer.start();
		});
	},
	methods: {
		getDiff: (start: number, end: number) => {
			let diffms = Math.abs(end - start) / 1000;
			const hours = Math.floor(diffms / 3600) % 24;
			diffms -= hours * 3600;
			const minutes = Math.floor(diffms / 60) % 60;
			diffms -= minutes * 60;
			return [hours, minutes];
		},
		deleteResult: async e => {
			await deleteResult(e);
		}
	}
};

const getUploadList = async () => {
	if (!getIdentificator()) createIdentificator();
	const response = await axiosInstance.get("/user/uploadedResults", {
		headers: {
			"x-user-id": getIdentificator()
		}
	});
	if (!response.data.success) return null;

	return response.data.data;
};
</script>
