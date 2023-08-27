<template>
	<div>
		<InfoBox />
		<HeroContent>
			<HeroFormContent />
		</HeroContent>
	</div>
</template>

<script setup lang="ts">
import { createIdentificator } from "@/util/identificator";

onMounted(async () => {
	await createIdentificator();
});
</script>
