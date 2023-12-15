import { getCookie, getVariable, setCookie } from "./helpers";
import { v4 as randomUUID } from "uuid";

export const createIdentificator = async () => {
		if (!process.client) return;

		await migrateId();

		const cookie = getCookie("identificator");
		if (cookie?.value) return;
		const uuid = randomUUID();

		setCookie("identificator", uuid);
		if (getVariable("identifier")) localStorage.removeItem("identificator");
	},
	getIdentificator = async (): Promise<string> => {
		if (!process.client) return "";

		await migrateId();
		const cookie = useCookie("identificator");
		if (cookie.value) return cookie.value;

		await createIdentificator();
		return getIdentificator();
	},
	migrateId = async (): Promise<void> => {
		if (!process.client) return;

		const uuid = await getVariable("identificator");
		const cookie = getCookie("identificator");

		if (!uuid) return;
		if (cookie?.value) return localStorage.removeItem("identificator");

		setCookie("identificator", uuid as string);
		localStorage.removeItem("identificator");
	};
