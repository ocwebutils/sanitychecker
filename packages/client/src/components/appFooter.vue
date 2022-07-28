<template>
	<div class="p-4 rounded-lg shadow md:flex md:items-center md:justify-between md:p-6">
		<span class="text-sm text-gray-500 sm:text-center dark:text-gray-400"
			>© {{ new Date().getFullYear() }} <a href="https://ocutils.me/" class="hover:underline">OpenCore Web Utilities</a>. All Rights Reserved.
			<div class="inline" v-if="commit">
				<font-awesome-icon icon="fa-solid fa-code-commit" /><a :href="'https://github.com/ocwebutils/sanitychecker/commit/' + commit"
					><code>{{ commit.substring(0, 6) }}</code></a
				>
			</div>
		</span>
		<ul class="md:flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 hidden">
			<li>
				<font-awesome-icon icon="fa-solid fa-cube" /> <code>{{ version }}</code>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
const config = useRuntimeConfig(),
	commit = config.COMMIT_HASH,
	version = config.WEBSITE_VERSION;
</script>
