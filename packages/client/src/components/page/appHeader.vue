<template>
	<nav class="flex lg:justify-center lg:items-center min-h-[4rem] mt-3 px-4">
		<div class="dropdown">
			<div class="flex flex-row">
				<nuxt-img alt="OCUtils' logo" src="/assets/favicons/logo.webp" height="32" width="32" class="self-center mx-auto inline lg:hidden" />
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<fa-icon class="h-5 w-5" size="lg" icon="fa-solid fa-bars" />
				</label>
			</div>
			<ul class="menu menu-compact dropdown-content bg-base-200 w-56 rounded-box">
				<li>
					<NuxtLink href="/">
						<fa-icon icon="fa-house" />
						Home
					</NuxtLink>
				</li>
				<li>
					<NuxtLink href="/privacy">
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
		<ul class="menu bg-base-200 lg:menu-horizontal rounded-box hidden">
			<nuxt-img alt="OCUtils' logo" src="/assets/favicons/logo.webp" height="32" width="32" class="self-center mx-auto inline" />
			<li>
				<NuxtLink href="/">
					<fa-icon icon="fa-house" />
					Home
				</NuxtLink>
			</li>
			<li>
				<NuxtLink href="/privacy">
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
			<ThemeChanger />
		</ul>
		<!-- <div class="navbar-start">
			<div class="dropdown">
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<fa-icon class="h-5 w-5" size="lg" icon="fa-solid fa-bars" />
				</label>
				<ul class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
					<li>
						<NuxtLink href="/privacy" class="flex items-center">
							<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
								><fa-icon icon="fa-solid fa-note-sticky" /> Privacy Policy</span
							>
						</NuxtLink>
					</li>
					<li>
						<a href="https://ocutils.me/discord" target="_blank" rel="noopener noreferrer" class="flex items-center">
							<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
								><fa-icon icon="fa-brands fa-discord" /> Discord</span
							>
						</a>
					</li>
				</ul>
			</div>
			<NuxtLink href="/">
				<span class="self-center text-2xl font-semibold whitespace-nowrap hover:text-blue-500 transition-colors">Sanity Checker</span>
			</NuxtLink>
		</div>
		<div class="navbar-end space-x-4">
			<NuxtLink href="/privacy" class="items-center hidden lg:flex">
				<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
					><fa-icon icon="fa-solid fa-note-sticky" /> Privacy Policy</span
				>
			</NuxtLink>
			<a href="https://ocutils.me/discord" target="_blank" rel="noopener noreferrer" class="items-center hidden lg:flex">
				<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
					><fa-icon icon="fa-brands fa-discord" /> Discord</span
				>
			</a>
			<ThemeChanger />
		</div> -->
	</nav>
</template>
