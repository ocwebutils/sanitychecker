<template>
	<div class="flex justify-center items-center">
		<div class="flex p-4 mt-3 mx-4 text-sm text-yellow-700 bg-yellow-100 rounded-lg dark:bg-yellow-200 dark:text-yellow-800 max-w-3xl" role="alert">
			<font-awesome-icon icon="fa-solid fa-circle-info" class="inline flex-shrink-0 mr-3 w-5 h-5" />
			<span class="sr-only">Warning</span>
			<div>
				<span class="font-bold">Warning!</span> Sanity Checker Rules are still in beta stage. Please report issues on our
				<a href="https://ocutils.me/discord" class="font-bold text-yellow-800 dark:text-yellow-900">discord server</a>
				<p>
					<span class="font-medium">Can't find expected property</span> errors are about missing properties in config. Visit
					<a
						href="https://github.com/acidanthera/OpenCorePkg/blob/master/Docs/Configuration.pdf"
						class="font-bold text-yellow-800 dark:text-yellow-900"
						>OpenCore documentation</a
					>
					for more information about required properties
				</p>
			</div>
		</div>
	</div>
</template>
