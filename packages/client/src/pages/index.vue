<template>
	<div>
		<!-- <LazyInfoBox /> -->
		<HeroContent>
			<HeroFormContent />
		</HeroContent>
	</div>
</template>

<script setup lang="ts">
import { createIdentificator } from "@/utils/identificator";

onMounted(async () => {
	await createIdentificator();
});
</script>
