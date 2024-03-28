import { Schema, model } from "mongoose";

import type { Result } from "server/interfaces/metadata.interface.js";

const ResultSchema: Schema = new Schema<Result>(
	{
		createdBy: { type: String, required: true },
		expireDate: { type: Number, required: true },
		resultId: { type: String, required: true },
		results: { type: Object, required: true },
		metadata: { type: Object, required: true },
	},
	{ strict: true }
);

ResultSchema.index({ createdBy: 1, resultId: 1 });

const ResultModel = model<Result>("results", ResultSchema);
export default ResultModel;
