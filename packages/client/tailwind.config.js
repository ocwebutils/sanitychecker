/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./src/components/**/*.{vue,js}", "./src/layouts/**/*.vue", "./src/pages/**/*.vue", "./src/plugins/**/*.{js,ts}"],
	darkMode: "class",
	theme: {
		extend: {}
	},
	variants: {
		extend: {}
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"]
	}
};
