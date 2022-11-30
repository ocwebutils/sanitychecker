import { marked } from "marked";

export const getIcon = (type: "success" | "info" | "warning" | "error") => {
	switch (type) {
		case "error": {
			return {
				icon: "fa-solid fa-circle-xmark",
				style: { color: "red" }
			};
		}
		case "warning": {
			return {
				icon: "fa-solid fa-circle-exclamation",
				style: { color: "orange" }
			};
		}
		case "info": {
			return {
				icon: "fa-solid fa-circle-info",
				style: { color: "rgb(59,130,246)" }
			};
		}
		case "success": {
			return {
				icon: "fa-solid fa-circle-check",
				style: { color: "green" }
			};
		}
	}
};

export const replaceBoolean = (str: string) => {
	const val = str.toString();
	switch (val) {
		case "true":
			return val.replace("true", "Enabled");
		case "false":
			return val.replace("false", "Disabled");
		default:
			return val;
	}
};

export const displayNormalizedName = (out: Record<string, any>, type: "schema" | "rule") => {
	switch (type) {
		case "schema": {
			return out.path.split("/").length === 2 && !out.type
				? `${out.path.split("/")[1]} → ${out.expectedValue}`
				: out.path.split("/").length <= 2
				? out.expectedValue
				: `${out.path.split("/")[1]} → ${out.expectedValue}`;
		}
		case "rule": {
			if (out.path.includes("Contents")) {
				return `${out.path.split("/")[1]} → ${out.path.split("/")[out.path.split("/").length - 2]}`;
			}
			return out.path.split("/").length >= 5
				? `${out.path.split("/")[1]} → ${out.path.split("/")[3]}.${out.path.split("/")[4]}:`
				: out.path.split("/")[2] === undefined
				? `${out.path.split("/")[1]}:`
				: `${out.path.split("/")[1]} → ${out.path.split("/")[2]}:`;
		}
	}
};

export const getVariable = (variable: string) => {
		if (!process.client) return;
		const returnVariable = localStorage.getItem(variable);
		if (isJson(returnVariable)) return JSON.parse(returnVariable);
		else return localStorage.getItem(variable);
	},
	setVariable = (variable: string, value: any) => {
		if (!process.client) return;
		localStorage.setItem(variable, JSON.stringify(value));
	},
	isJson = str => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

export const parseMarked = (string: string) => {
	const stringToHtml = marked.parse(string);

	return stringToHtml;
};
