import type { SchemaType, ValueType } from "@/interfaces/metadata";

import { marked } from "marked";

export const getIcon = (type: "success" | "info" | "warning" | "error") => {
	switch (type) {
		case "error": {
			return {
				icon: "fa-solid fa-circle-xmark",
				style: { color: "red" },
			};
		}

		case "warning": {
			return {
				icon: "fa-solid fa-circle-exclamation",
				style: { color: "orange" },
			};
		}

		case "info": {
			return {
				icon: "fa-solid fa-circle-info",
				style: { color: "rgb(59,130,246)" },
			};
		}

		case "success": {
			return {
				icon: "fa-solid fa-circle-check",
				style: { color: "green" },
			};
		}

		default:
			return { icon: null, style: null };
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

		default:
			return `${out.path.split("/")[1]} → ${out.path.split("/")[2]}:`;
	}
};

export const getVariable = <T = unknown>(variable: string): T | null => {
		if (!process.client) return null;

		const returnVariable = localStorage.getItem(variable);
		if (!returnVariable) return null;

		if (isJson(returnVariable)) return JSON.parse(returnVariable) as T;
		return localStorage.getItem(variable) as T;
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
			domain,
		});

		return cookie;
	},
	setCookie = (name: string, value: string): boolean => {
		if (!process.client) return false;

		const domain = process.dev ? "localhost" : window.location.hostname.replace(/^(?:[^.]+\.)?(\w+\.\w+)$/, "$1");
		const cookie = useCookie(name, {
			expires: new Date(new Date().getTime() + 1000 * 60 * 60 * 24 * 365),
			domain,
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
		} catch {
			return false;
		}

		return true;
	};
export const parseMarked = (string: string): string => {
	const stringToHtml = marked.parse(string, { breaks: true }) as string;
	return stringToHtml;
};

export const json2csv = (results: { rulesResults: ValueType[]; schemaResults: { errorArray: SchemaType[]; missingRoot: string[] } }): string => {
	const headers = ["path", "actualValue", "expectedValue", "ruleSetType", "ruleSetMessage"];
	const rows: string[][] = [];

	for (const ruleResult of results.rulesResults) {
		const row = [
			ruleResult.path,
			ruleResult.actualValue?.toString() ?? "",
			ruleResult.expectedValue ?? "",
			ruleResult.ruleSet.type,
			ruleResult.ruleSet.message ? `"${ruleResult.ruleSet.message}"` : "",
		];
		rows.push(row);
	}

	for (const schemaResult of results.schemaResults.errorArray) {
		const row = [
			schemaResult.path,
			"",
			schemaResult.expectedValue ?? "",
			schemaResult.ruleSet.type,
			schemaResult.ruleSet.message ? `"${schemaResult.ruleSet.message}"` : "",
		];
		rows.push(row);
	}

	for (const missingProperty of results.schemaResults.missingRoot) {
		const row = [missingProperty, "", "", "missing root property", "missing root property"];
		rows.push(row);
	}

	const result = [headers, ...rows].map(row => row.join(",")).join("\n");
	return result;
};

export const readFileAsBase64 = async (blob: File): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();

		reader.onload = () => {
			resolve(reader.result as string);
		};

		reader.onerror = () => {
			reject(new Error("Error reading the file."));
		};

		reader.readAsDataURL(blob);
	});
};
