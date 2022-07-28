import { defineNuxtConfig } from "nuxt";
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
				{ rel: "manifest", href: "/assets/favicons/site.webmanifest" },
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
	colorMode: {
		classSuffix: ""
	},
	components: {
		global: true,
		dirs: ["components"]
	},
	css: ["vue-toastification/dist/index.css", "@fortawesome/fontawesome-svg-core/styles.css", "assets/css/tailwind.css"],
	build: {
		transpile: [
			"@fortawesome/vue-fontawesome",
			"@fortawesome/fontawesome-svg-core",
			"@fortawesome/free-brands-svg-icons",
			"@fortawesome/free-solid-svg-icons"
		],
		postcss: {
			postcssOptions: {
				plugins: {
					tailwindcss: {},
					autoprefixer: {}
				}
			}
		}
	},
	modules: ["@nuxtjs/color-mode"],
	publicRuntimeConfig: {
		BASE_API_URL: process.env.NODE_ENV !== "production" ? "http://192.168.0.59:3030/api/v1" : "https://api.ocutils.me/api/v1",
		COMMIT_HASH: process.env.COMMIT_HASH,
		WEBSITE_VERSION: version
	},
	target: "static",
	srcDir: "src/",
	ssr: true
});
