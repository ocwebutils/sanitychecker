<template>
	<div class="p-4 md:flex md:items-center md:justify-between md:p-6">
		<span class="text-sm text-gray-500 dark:text-gray-400"
			>© {{ new Date().getFullYear() }} <a href="https://ocutils.me/" class="hover:underline">OpenCore Web Utilities</a>. All Rights Reserved.
		</span>

		<ul class="md:flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 hidden space-x-4">
			<li v-if="commit">
				<font-awesome-icon icon="fa-solid fa-code-commit" class="mr-1" />
				<code
					><a :href="'https://github.com/ocwebutils/sanitychecker/commit/' + commit" class="hover:text-blue-500 transition-colors">{{
						version
					}}</a></code
				>
			</li>
			<li v-if="getPackageVersions">
				<font-awesome-icon icon="fa-solid fa-cube" class="mr-1" />
				<code
					><a href="https://github.com/ocwebutils/rules" class="hover:text-blue-500 transition-colors">{{ packageVersions.rulesVersion }}</a></code
				>
			</li>
		</ul>
	</div>
</template>
<script setup lang="ts">
import { axiosInstance } from "@/util/axiosInstance";

const config = useRuntimeConfig();

const getPackageVersions = async () => {
	try {
		const response = await axiosInstance.get("/packageVersions");
		if (!response.data.success || !response.data.data) return null;

		return response.data.data;
	} catch (error) {
		return null;
	}
};

const commit = config.public.COMMIT_HASH,
	version = config.public.WEBSITE_VERSION,
	packageVersions = await getPackageVersions();
</script>
