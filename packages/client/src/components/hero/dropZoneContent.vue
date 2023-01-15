<template>
	<dropZone #default="{ dropZoneActive }" @fileDropped="$emit('dropFileHandler', $event)">
		<div class="flex justify-center items-center w-full">
			<label
				for="dropzone-file"
				class="flex flex-col justify-center items-center w-full h-64 bg-gray-50 rounded-lg border-2 border-gray-300 cursor-pointer dark:hover:bg-bray-800 dark:bg-darkgray-800 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-darkgray-700"
				v-bind:class="dropZoneActive ? 'border-solid dark:bg-bray-800 dark:border-gray-500 dark:bg-darkgray-700' : 'hover:border-solid border-dashed'"
			>
				<div class="flex flex-col justify-center items-center pt-5 pb-6">
					<font-awesome-icon icon="fa-solid fa-cloud-arrow-up" class="mb-3 w-10 h-10 text-gray-400 dark:text-gray-300" />
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-300" v-if="dropZoneActive">
						<span class="font-semibold">Drop your config here</span>
					</p>
					<p class="mb-2 text-sm text-gray-500 dark:text-gray-300" v-else><span class="font-semibold">Click to upload</span> or drag and drop</p>
					<p class="text-xs text-gray-500 dark:text-gray-300">.PLIST (MAX. 2MB)</p>
				</div>
				<input id="dropzone-file" type="file" @change="$emit('dropFileHandler', $event)" class="hidden" accept=".plist" />
			</label>
		</div>
	</dropZone>
</template>
