import { marked } from "marked";

export const parseMarked = (string: string) => {
	const stringToHtml = marked.parse(string);

	return stringToHtml;
};
