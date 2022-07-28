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
</script>

<style>
.dark {
	@apply text-white bg-gray-900;
}
.light {
	@apply text-black bg-white;
}
</style>
