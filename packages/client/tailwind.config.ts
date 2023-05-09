module.exports = {
	content: ["./src/components/**/*.{vue,ts}", "./src/layouts/**/*.vue", "./src/pages/**/*.vue", "./src/plugins/**/*.ts"],
	darkMode: "class",
	theme: {
		extend: {
			colors: {
				darkgray: {
					50: "#ecf2f8",
					300: "#c6cdd5",
					500: "#89929b",
					700: "#21262d",
					800: "#161b22",
					900: "#0d1117"
				}
			}
		}
	},
	plugins: [require("daisyui")],
	daisyui: {
		themes: ["light", "dark"]
	}
};
