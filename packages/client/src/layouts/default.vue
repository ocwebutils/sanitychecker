<template>
	<div>
		<ClientOnly>
			<div class="flex flex-col h-screen" tabindex="0">
				<PageAppHeader />
				<div class="flex-grow m-auto">
					<slot />
				</div>
				<PageAppFooter />
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
