<template>
	<div>
		<button
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-gray-600"
			aria-label="Toggle between dark and light mode"
			type="button"
			@click="changeThemeColor"
		>
			<fa-icon class="h-5 w-5" size="lg" :icon="icon" :style="{ color: 'white' }" />
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

			if (this.$colorMode.value === "light") htmlSelector.setAttribute("data-theme", "dark");
			else htmlSelector.setAttribute("data-theme", "light");
			this.$colorMode.preference = this.$colorMode.value === "light" ? "dark" : "light";
		}
	}
};
</script>
