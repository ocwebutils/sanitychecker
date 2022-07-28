<template>
	<div><FormUploadedFiles /></div>
	<div class="flex flex-row items-center place-items-center justify-center">
		<input id="uploadConfig" type="checkbox" class="toggle toggle-sm" disabled />
		<label for="uploadConfig" class="ml-2 text-sm font-medium"
			>Private result (SOON)
			<div class="tooltip" data-tip="Your result will be private. You will receive a key that will allow to view result">
				<font-awesome-icon class="sm:ml-2 inline" icon="fa-solid fa-question" /></div
		></label>
		<div class="divider divider-horizontal" />
		<label for="uploadedFilesModal" class="btn modal-button">Show Uploaded Results</label>
	</div>
</template>
