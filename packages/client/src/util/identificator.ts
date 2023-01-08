import { getVariable, setVariable } from "./utils";

export const createIdentificator = () => {
		if (!process.client) return;
		const uuid = crypto.randomUUID();
		if (getIdentificator()) return;
		setVariable("identificator", uuid);
	},
	getIdentificator = () => {
		if (!process.client) return;
		return getVariable("identificator");
	};
