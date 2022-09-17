import { getVariable, setVariable } from "./localstorage";

import { v4 as uuidv4 } from "uuid";

export const createIdentificator = () => {
		if (!process.client) return;
		const uuid = uuidv4();
		if (getIdentificator()) return;
		setVariable("identificator", uuid);
	},
	getIdentificator = () => {
		if (!process.client) return;
		return getVariable("identificator");
	};
