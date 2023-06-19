import { SchemaType, ValueType } from "@/interfaces/metadata";

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

		default: {
			return { icon: null, style: null };
		}
	}
};

export const replaceBoolean = (str: string) => {
	const val = str.toString();
	switch (val) {
		case "true":
			return val.replace(/true/g, "Enabled");
		case "false":
			return val.replace(/false/g, "Disabled");
		default:
			return val;
	}
};

export const displayNormalizedName = (out: ValueType | SchemaType, type: "schema" | "rule"): string => {
	switch (type) {
		case "schema": {
			const schemaOut = out as SchemaType;
			return schemaOut.path.split("/").length === 2 && !schemaOut.type
				? `${schemaOut.path.split("/")[1]} → ${schemaOut.expectedValue}`
				: schemaOut.path.split("/").length <= 2
				? schemaOut.expectedValue
				: `${schemaOut.path.split("/")[1]} → ${schemaOut.expectedValue}`;
		}

		case "rule": {
			const ruleOut = out as ValueType;
			if (ruleOut.path.includes("Contents")) return `${ruleOut.path.split("/")[1]} → ${ruleOut.path.split("/")[ruleOut.path.split("/").length - 2]}`;

			return ruleOut.path.split("/").length >= 5
				? `${ruleOut.path.split("/")[1]} → ${ruleOut.path.split("/")[3]}.${ruleOut.path.split("/")[4]}:`
				: ruleOut.path.split("/")[2] === undefined
				? `${ruleOut.path.split("/")[1]} →`
				: `${ruleOut.path.split("/")[1]} → ${ruleOut.path.split("/")[2]}:`;
		}

		default: {
			return `${out.path.split("/")[1]} → ${out.path.split("/")[2]}:`;
		}
	}
};

export const getVariable = (variable: string): unknown => {
		if (!process.client) return;

		const returnVariable = localStorage.getItem(variable);
		if (!returnVariable) return null;

		if (isJson(returnVariable)) return JSON.parse(returnVariable) as Record<string, unknown>;
		else return localStorage.getItem(variable);
	},
	setVariable = (variable: string, value: unknown): void => {
		if (!process.client) return;

		localStorage.setItem(variable, JSON.stringify(value));
	},
	getCookie = (name: string) => {
		if (!process.client) return;

		const domain = process.dev ? "localhost" : window.location.hostname.replace(/^(?:[^.]+\.)?(\w+\.\w+)$/, "$1");

		const cookie = useCookie(name, {
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
			domain
		});

		return cookie;
	},
	setCookie = (name: string, value: string): boolean | void => {
		if (!process.client) return;

		const domain = process.dev ? "localhost" : window.location.hostname.replace(/^(?:[^.]+\.)?(\w+\.\w+)$/, "$1");

		const cookie = useCookie(name, {
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
			domain
		});

		try {
			cookie.value = value;
		} catch {
			return false;
		}

		return true;
	},
	isJson = (str: string) => {
		try {
			JSON.parse(str);
		} catch (e) {
			return false;
		}
		return true;
	};

export const parseMarked = (string: string): string => {
	const stringToHtml = marked.parse(string, { mangle: false, headerIds: false });

	return stringToHtml;
};
