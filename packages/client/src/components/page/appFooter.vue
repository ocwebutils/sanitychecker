<template>
	<footer class="p-4 md:flex md:items-center md:justify-between md:p-6">
		<span class="text-sm text-gray-500 dark:text-gray-400"
			>© 2022-{{ new Date().getFullYear() }} <a href="https://ocutils.me/" class="hover:underline">OpenCore Web Utilities</a>. All Rights Reserved.
		</span>

		<ul class="md:flex flex-wrap items-center mt-3 text-sm text-gray-500 dark:text-gray-400 sm:mt-0 hidden space-x-4">
			<li v-if="commit">
				<fa-icon icon="fa-solid fa-code-commit" class="mr-1" />
				<code
					><a :href="'https://github.com/ocwebutils/sanitychecker/commit/' + commit" class="hover:underline transition-colors">{{
						`${commit.slice(0, 7)} (${version})`
					}}</a></code
				>
			</li>
			<li v-if="packageVersions">
				<fa-icon icon="fa-solid fa-cube" class="mr-1" />
				<code
					><a href="https://github.com/ocwebutils/sc_rules" class="hover:underline transition-colors">{{ packageVersions.rulesVersion }}</a></code
				>
			</li>
		</ul>
	</footer>
</template>
<script setup lang="ts">
import { axiosInstance } from "@/utils/axiosInstance";

const config = useRuntimeConfig();

const getPackageVersions = async () => {
	try {
		const { data } = await axiosInstance.get("/packageVersions");
		if (!data.success || !data.data) return null;

		return data.data;
	} catch {
		return null;
	}
};

const commit = config.public.COMMIT_HASH,
	version = config.public.WEBSITE_VERSION,
	packageVersions = await getPackageVersions();
</script>
