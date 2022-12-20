<template>
	<div class="navbar container mx-auto px-4 pt-5">
		<div class="navbar-start">
			<div class="dropdown">
				<label tabindex="0" class="btn btn-ghost lg:hidden">
					<font-awesome-icon class="h-5 w-5" size="lg" icon="fa-solid fa-bars" />
				</label>
				<ul class="menu menu-compact dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
					<li>
						<NuxtLink href="/privacy" class="flex items-center">
							<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
								><font-awesome-icon icon="fa-solid fa-note-sticky" /> Privacy Policy</span
							>
						</NuxtLink>
					</li>
					<li>
						<a href="https://ocutils.me/discord" target="_blank" class="flex items-center">
							<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
								><font-awesome-icon icon="fa-brands fa-discord" /> Discord</span
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
					><font-awesome-icon icon="fa-solid fa-note-sticky" /> Privacy Policy</span
				>
			</NuxtLink>
			<a href="https://ocutils.me/discord" target="_blank" class="items-center hidden lg:flex">
				<span class="self-center text-xl font-medium whitespace-nowrap hover:text-blue-500 transition-colors"
					><font-awesome-icon icon="fa-brands fa-discord" /> Discord</span
				>
			</a>
			<NavbarThemeChanger />
		</div>
	</div>
</template>
