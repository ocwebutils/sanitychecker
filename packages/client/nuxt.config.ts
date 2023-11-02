import { version } from "./package.json";

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: "en"
			},
			title: "OpenCore Sanity Checker",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "msapplication-TileColor", content: "#111827" },
				{
					hid: "keywords",
					name: "keywords",
					content:
						"opencore, opencore sanity checker, sanity checker, plist checker, sanity checker plist, opencore plist, opencore config, opencore config sanity checker, ocutils"
				},
				{
					hid: "robots",
					property: "robots",
					content: "index, archive"
				}
			],
			link: [
				{ rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicons/favicon-16x16.png" },
				{ rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicons/favicon-32x32.png" },
				{ rel: "mask-icon", color: "#111827", href: "/assets/favicons/safari-pinned-tab.svg" }
			],
			script: [
				{
					defer: true,
					"data-api": "https://analytics.ocutils.me/api/sendData",
					"data-domain": "ocutils.me",
					src: "https://analytics.ocutils.me/js/script.js"
				},
				{
					src: "/assets/js/plist.min.js?v=3.0.7"
				}
			]
		}
	},
	build: {
		transpile: [
			"@fortawesome/vue-fontawesome",
			"@fortawesome/fontawesome-svg-core",
			"@fortawesome/free-brands-svg-icons",
			"@fortawesome/free-solid-svg-icons",
			"vue-toastification"
		]
	},
	colorMode: {
		classSuffix: ""
	},
	components: {
		global: true,
		dirs: ["components"]
	},
	css: ["vue-toastification/dist/index.css", "@fortawesome/fontawesome-svg-core/styles.css"],
	modules: ["@nuxtjs/color-mode", "@nuxtjs/tailwindcss", "@nuxt/image", "@kevinmarrec/nuxt-pwa"],
	pwa: {
		manifest: {
			name: "OpenCore Sanity Checker",
			short_name: "ocs | ocutils",
			description: "OpenCore Sanity Checker made by OpenCore Web Utilities allows to check your OpenCore config for potential issues",
			icons: [
				{
					src: "/assets/favicons/android-chrome-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "any"
				},
				{
					src: "/assets/favicons/android-chrome-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable"
				}
			],
			display: "standalone"
		},
		meta: {
			name: "OpenCore Sanity Checker",
			description: "OpenCore Sanity Checker made by OpenCore Web Utilities allows to check your OpenCore config for potential issues"
		},
		workbox: {
			enabled: true,
			templatePath: "@/serviceworker.js"
		}
	},
	runtimeConfig: {
		public: {
			COMMIT_HASH: process.env.COMMIT_HASH,
			WEBSITE_VERSION: version
		}
	},
	tailwindcss: {
		viewer: false
	},
	typescript: {
		strict: true
	},
	srcDir: "src/",
	ssr: true,
	vite: {
		server: {
			watch: {
				usePolling: true
			}
		}
	}
});
