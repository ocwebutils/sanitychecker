import { getCookie, getVariable, setCookie } from "./utils";

export const createIdentificator = async () => {
		if (!process.client) return;

		await migrateId();

		const cookie = getCookie("identificator");
		if (cookie?.value) return;
		const uuid = crypto.randomUUID();

		setCookie("identificator", uuid);
		if (getVariable("identifier")) localStorage.removeItem("identificator");
	},
	getIdentificator = async (): Promise<unknown | string | null> => {
		if (!process.client) return;

		await migrateId();
		const cookie = useCookie("identificator", { watch: "shallow" });
		if (cookie.value) return cookie.value;

		await createIdentificator();
		return getIdentificator();
	},
	migrateId = async (): Promise<void> => {
		if (!process.client) return;

		const uuid = await getVariable("identificator");

		if (!uuid) return;

		setCookie("identificator", uuid as string);
		localStorage.removeItem("identificator");
	};
