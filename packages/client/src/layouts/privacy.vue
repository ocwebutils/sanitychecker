<template>
	<div>
		<ClientOnly>
			<div class="flex flex-col h-screen" tabindex="0">
				<PageAppHeader />
				<main class="flex-grow mx-auto">
					<slot />
				</main>
				<PageAppFooter />
			</div>
		</ClientOnly>
	</div>
</template>

<script setup lang="ts">
const colorMode = useColorMode();

onMounted(() => {
	const htmlSelector = document.querySelector("html");
	if (!htmlSelector) return;
	if (colorMode.value === "light") htmlSelector.setAttribute("data-theme", "light");
	else htmlSelector.setAttribute("data-theme", "dark");
});
</script>
