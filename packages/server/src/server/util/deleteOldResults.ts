import ResultModel from "server/database/models/Result.js";

export const deleteOldResults = async () => {
	const query = await ResultModel.find({}).select(["expireDate", "resultId"]).lean();

	if (!query) return;

	for (const el of query) {
		const expireDate = el.expireDate,
			diff = getDiffInMinutes(Date.now(), expireDate) <= 0;

		if (diff) await ResultModel.deleteOne({ resultId: el.resultId });
	}
};

const getDiffInMinutes = (start: number, end: number) => {
	const diff = end - start;
	return Math.floor(diff / (1000 * 60));
};
