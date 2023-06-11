<template>
	<div><FormUploadedFilesModal /></div>
	<div class="flex flex-row items-center place-items-center justify-center">
		<label class="btn" onclick="uploadedFilesModal.showModal()">Show Uploaded Results</label>
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
