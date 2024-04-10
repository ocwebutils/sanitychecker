<template>
	<!-- <LazyInfoBox /> -->
	<HeroContent>
		<HeroFormContent />
	</HeroContent>
</template>

<script setup lang="ts">
import { createIdentificator } from "@/utils/identificator";

onMounted(async () => {
	await createIdentificator();
});
</script>
