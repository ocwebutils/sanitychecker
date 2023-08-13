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
						<svg
							class="flex-shrink-0 w-5 h-5 text-green-500 dark:text-green-400"
							fill="currentColor"
							viewBox="0 0 20 20"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								fill-rule="evenodd"
								d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
								clip-rule="evenodd"
							></path>
						</svg>
						<span>{{ feature }}</span>
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
