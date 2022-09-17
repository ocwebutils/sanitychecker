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
