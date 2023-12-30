<template>
	<nav class="flex lg:justify-center lg:items-center min-h-[4rem] mt-3 px-4">
		<div class="daisy-dropdown">
			<div class="flex flex-row">
				<nuxt-img alt="OCUtils' logo" src="/assets/favicons/logo.webp" height="32" width="32" class="self-center mx-auto inline lg:hidden" />
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<fa-icon class="h-5 w-5" size="lg" icon="fa-solid fa-bars" />
				</label>
			</div>
			<ul class="daisy-menu daisy-menu-compact daisy-dropdown-content bg-base-200 w-56 rounded-box" tabindex="0">
				<li>
					<NuxtLink href="/" :class="$route.path === '/' ? 'daisy-active' : ''">
						<fa-icon icon="fa-house" />
						Home
					</NuxtLink>
				</li>
				<li v-if="$route.path.includes('/results/')">
					<NuxtLink :href="$route.fullPath" :class="$route.path.includes('/results/') ? 'daisy-active' : ''">
						<fa-icon icon="fa-square-poll-horizontal" />
						Validation Result
					</NuxtLink>
				</li>
				<li>
					<NuxtLink href="/privacy" :class="$route.path === '/privacy' ? 'daisy-active' : ''">
						<fa-icon icon="fa-gavel" />
						Privacy Policy
					</NuxtLink>
				</li>
				<li>
					<NuxtLink href="https://ocutils.me/discord">
						<fa-icon icon="fa-brands fa-discord" />
						Discord
					</NuxtLink>
				</li>
			</ul>
		</div>
		<div class="daisy-menu bg-base-200 lg:daisy-menu-horizontal rounded-box hidden">
			<nuxt-img alt="OCUtils' logo" src="/assets/favicons/logo.webp" height="32" width="32" class="self-center mx-auto inline" />
			<ul class="flex flex-row">
				<li>
					<NuxtLink href="/" :class="$route.path === '/' ? 'daisy-active' : ''">
						<fa-icon icon="fa-house" />
						Home
					</NuxtLink>
				</li>
				<li v-if="$route.path.includes('/results/')">
					<NuxtLink :href="$route.fullPath" :class="$route.path.includes('/results/') ? 'daisy-active' : ''">
						<fa-icon icon="fa-square-poll-horizontal" />
						Validation Result
					</NuxtLink>
				</li>
				<li>
					<NuxtLink href="/privacy" :class="$route.path === '/privacy' ? 'daisy-active' : ''">
						<fa-icon icon="fa-gavel" />
						Privacy Policy
					</NuxtLink>
				</li>
				<li>
					<NuxtLink href="https://ocutils.me/discord">
						<fa-icon icon="fa-brands fa-discord" />
						Discord
					</NuxtLink>
				</li>
			</ul>
			<ThemeChanger class="pl-1" />
		</div>
	</nav>
</template>
