import debug from "debug";
import "dotenv/config";

export const logger: debug.Debugger = debug("ocwebutils/sanitychecker:server"),
	port = Number(process.env.PORT) || 3030;
