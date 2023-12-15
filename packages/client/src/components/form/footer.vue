<template>
	<div><FormUploadedFilesModal /></div>
	<div class="flex flex-row items-center place-items-center justify-center">
		<label class="btn" onclick="uploadedFilesModal.showModal()">Show Uploaded Results</label>
		<!-- <div class="divider divider-horizontal"></div>
		<div class="form-control">
			<label class="label cursor-pointer">
				<input id="checkboxIncludeConfig" type="checkbox" class="toggle mr-2" />
				<span class="label-text">Include config (beta)</span>
			</label>
		</div> -->
	</div>
</template>
<script setup lang="ts">
useHead({
	script: [
		{
			src: "https://cdn.jsdelivr.net/gh/nuxodin/dialog-polyfill@v1.4.1/dialog.min.js",
			type: "module"
		}
	]
});
</script>
