<template>
	<div>
		<ClientOnly>
			<div class="flex flex-col h-screen">
				<NavbarAppHeader />
				<div class="flex-grow m-auto">
					<slot />
				</div>
				<appFooter />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";

const colorMode = useColorMode();

onMounted(() => {
	colorMode.value === "light"
		? document.querySelector("html").setAttribute("data-theme", "light")
		: document.querySelector("html").setAttribute("data-theme", "dark");
});

if (process.client) {
	const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
	if (isSafari) {
		useHead({
			script: [
				{
					src: "/assets/js/safari_polyfill.min.js?v=1.0.0"
				}
			]
		});
	}
}
</script>

<style>
.dark {
	@apply text-white bg-gray-900;
}
.light {
	@apply text-black bg-white;
}
</style>
