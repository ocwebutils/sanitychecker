import { connect } from "mongoose";
import { logger } from "../config.js";

export default async function connectDatabase(): Promise<void> {
	try {
		await connect(process.env.DATABASE_URL as string, {
			serverSelectionTimeoutMS: 10000,
			connectTimeoutMS: 10000,
		});

		logger.extend("database")("Successfully connected to database");
	} catch (err) {
		logger.extend("database")("There was an error when connecting to database: %o", err);
	}
}
