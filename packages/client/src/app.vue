<template>
	<VitePwaManifest />
	<NuxtLoadingIndicator />
	<Toaster richColors position="top-right" />
	<NuxtLayout>
		<NuxtPage />
	</NuxtLayout>
</template>

<script setup lang="ts">
import "@/assets/css/tailwind.css";
import "@/assets/css/main.css";
</script>
