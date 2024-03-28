import { XMLValidator } from "fast-xml-parser";

export function validatePlist(file: Blob): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				XMLValidator.validate(reader.result as string, {
					allowBooleanAttributes: true,
				});

				resolve(true);
			} catch {
				reject(false);
			}
		};

		reader.readAsText(file);
	});
}

export function parsePlist(file: Blob): Promise<object | boolean> {
	return new Promise<object | boolean>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				// @ts-expect-error: plist.js is imported with script tag
				const result = plist.parse(reader.result as string);
				if (typeof result === "object") resolve(result);
				else reject(false);
			} catch {
				reject(false);
			}
		};

		reader.readAsText(file);
	});
}
