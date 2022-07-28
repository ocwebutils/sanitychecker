import { v4 as uuidv4 } from "uuid";

export const createIdentificator = () => {
		if (process.client) {
			const uuid = uuidv4();
			if (getIdentificator()) return;
			localStorage.setItem("identificator", uuid);
		}
	},
	getIdentificator = () => {
		if (process.client) {
			return localStorage.getItem("identificator");
		}
	};
