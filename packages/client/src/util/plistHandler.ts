import { XMLValidator } from "fast-xml-parser";

export function validateplist(file: Blob): Promise<boolean> {
	return new Promise<boolean>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				XMLValidator.validate(reader.result as string, {
					allowBooleanAttributes: true
				});

				resolve(true);
			} catch (e) {
				reject(false);
			}
		};
		reader.readAsText(file);
	});
}

export function parseplist(file: Blob): Promise<object | boolean> {
	return new Promise<object | boolean>((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			// @ts-expect-error: We import browser build of plist.js
			const result = plist.parse(reader.result as string);
			if (typeof result === "object") resolve(result);
			else reject(false);
		};
		reader.readAsText(file);
	});
}
