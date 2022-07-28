<template>
	<div
		:data-active="active"
		@dragenter.prevent="setActive"
		@dragover.prevent="setActive"
		@dragleave.prevent="setInactive"
		@drop.prevent="onDrop"
	>
		<slot :dropZoneActive="active"></slot>
	</div>
</template>

<script setup>
import { onMounted, onUnmounted } from "vue";

onMounted(() => {
	events.forEach(eventName => {
		document.body.addEventListener(eventName, preventDefaults);
	});
});

onUnmounted(() => {
	events.forEach(eventName => {
		document.body.removeEventListener(eventName, preventDefaults);
	});
});

const emit = defineEmits(["fileDropped"]),
	events = ["dragenter", "dragover", "dragleave", "drop"];

let active = ref(false),
	inactiveTimeout = null;

const setActive = () => {
		active.value = true;
		clearTimeout(inactiveTimeout);
	},
	setInactive = () => {
		active.value = false;
		inactiveTimeout = setTimeout(() => {
			active.value = false;
		}, 100);
	},
	onDrop = event => {
		setInactive();
		emit("fileDropped", [...event.dataTransfer.files]);
	},
	preventDefaults = event => {
		event.preventDefault();
	};
</script>
