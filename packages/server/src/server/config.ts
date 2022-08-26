import { config } from "dotenv";
import debug from "debug";
config({ path: "./.env" });

export const logger: debug.Debugger = debug("ocwebutils/sanitychecker:server"),
	port = Number(process.env.PORT) || 3030;
