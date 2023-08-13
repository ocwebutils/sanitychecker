<template>
	<div>
		<button
			class="flex h-9 w-9 items-center justify-center rounded-xl bg-neutral-500"
			aria-label="Toggle between dark and light mode"
			type="button"
			@click="changeThemeColor"
		>
			<fa-icon class="h-5 w-5" size="lg" :icon="icon" :style="{ color: 'black' }" />
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

			htmlSelector.setAttribute("data-theme", this.$colorMode.value === "light" ? "dark" : "light");
			this.$colorMode.preference = this.$colorMode.value === "light" ? "dark" : "light";
		}
	}
};
</script>
