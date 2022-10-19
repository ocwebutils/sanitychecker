import { version } from "./package.json";

export default defineNuxtConfig({
	app: {
		head: {
			htmlAttrs: {
				lang: "en"
			},
			title: "OpenCore Sanity Checker | OCUtils",
			meta: [
				{ charset: "utf-8" },
				{ name: "viewport", content: "width=device-width, initial-scale=1" },
				{ name: "msapplication-TileColor", content: "#111827" },
				{ name: "theme-color", content: "#111827" },
				{
					hid: "description",
					name: "description",
					content: "OpenCore Sanity Checker allows you to check your OpenCore config for potential issues"
				},
				{
					hid: "og:title",
					property: "og:title",
					content: "OpenCore Sanity Checker | OCUtils"
				},
				{
					hid: "og:description",
					property: "og:description",
					content: "OpenCore Sanity Checker allows you to check your OpenCore config for potential issues"
				},
				{
					hid: "og:type",
					property: "og:type",
					content: "website"
				}
			],
			link: [
				{ rel: "apple-touch-icon", sizes: "180x180", href: "/assets/favicons/apple-touch-icon.png" },
				{ rel: "icon", type: "image/png", sizes: "16x16", href: "/assets/favicons/favicon-16x16.png" },
				{ rel: "icon", type: "image/png", sizes: "32x32", href: "/assets/favicons/favicon-32x32.png" },
				{ rel: "manifest", href: "/site.webmanifest" },
				{ rel: "mask-icon", color: "#111827", href: "/assets/favicons/safari-pinned-tab.svg" }
			],
			script: [
				{
					defer: true,
					"data-api": "https://analytics.ocutils.me/api/sendData",
					"data-domain": "ocutils.me",
					src: "https://analytics.ocutils.me/js/script.js"
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
	css: ["vue-toastification/dist/index.css", "@fortawesome/fontawesome-svg-core/styles.css", "assets/css/tailwind.css"],
	experimental: {
		writeEarlyHints: false
	},
	modules: ["@nuxtjs/color-mode", "@nuxtjs/tailwindcss"],
	runtimeConfig: {
		public: {
			COMMIT_HASH: process.env.COMMIT_HASH,
			WEBSITE_VERSION: version
		}
	},
	target: "static",
	tailwindcss: {
		viewer: false
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
