<template>
	<section class="hero">
		<div class="hero-content flex-col-reverse lg:flex-row-reverse">
			<div class="text-center lg:text-left lg:pl-7">
				<h1 class="text-2xl font-bold text-center">
					<nuxt-img alt="OCUtils' logo" src="/assets/favicons/logo.webp" height="32" width="32" class="self-center mx-auto inline" /> OpenCore Sanity
					Checker
				</h1>
				<p class="text-gray-900 dark:text-gray-300 text-lg text-center mb-4">Advanced Sanity Checker for latest OpenCore versions</p>
				<ul class="mb-8 space-y-4 text-left text-gray-700 dark:text-gray-400">
					<li v-for="feature in featuresList" class="flex items-center space-x-3">
						<fa-icon
							:icon="feature.mark === 'success' ? 'fa-check' : 'fa-xmark'"
							:style="{ color: feature.mark === 'success' ? 'green' : 'red' }"
						></fa-icon>
						<span>{{ feature.message }}</span>
					</li>
				</ul>
			</div>
			<slot />
		</div>
	</section>
</template>
<script setup lang="ts">
import featuresList from "@/features";
</script>
