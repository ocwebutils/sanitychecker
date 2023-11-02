import { Schema, model } from "mongoose";

const ConfigSchema: Schema = new Schema(
	{
		configId: { type: String, required: true },
		createdBy: { type: String, required: true },
		configData: { type: Buffer, required: true }
	},
	{ strict: true }
);

ConfigSchema.index({ createdBy: 1, resultId: 1 });

const ConfigModel = model("configs", ConfigSchema);
export default ConfigModel;
