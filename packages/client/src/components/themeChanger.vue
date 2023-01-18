<template>
	<div>
		<button
			class="flex space-x-2 transition-colors btn btn-circle items-center justify-center bg-gray-200"
			aria-label="Switch Colors button"
			@click="changeThemeColor"
		>
			<font-awesome-icon class="h-5 w-5" size="lg" :icon="icon" :style="{ color: 'black' }" />
		</button>
	</div>
</template>

<script lang="ts">
export default {
	computed: {
		icon() {
			return this.$colorMode.value === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
		}
	},
	methods: {
		changeThemeColor() {
			const htmlSelector = document.querySelector("html");

			if (!htmlSelector) return;

			htmlSelector.getAttribute("data-theme") === "light"
				? htmlSelector.setAttribute("data-theme", "dark")
				: htmlSelector.setAttribute("data-theme", "light");
			this.$colorMode.preference = this.$colorMode.value === "light" ? "dark" : "light";
		}
	}
};
</script>
