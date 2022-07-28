import { context } from "../database";

export const deleteOldResults = async () => {
	const query = await context.prisma.results.findMany();

	if (!query) return null;

	for (const el of query) {
		const expireDate = el.expireDate,
			diff = getDiffInMinutes(Date.now(), expireDate) <= 0;

		if (diff) {
			await context.prisma.results.delete({
				where: {
					resultId: el.resultId
				}
			});
		}
	}
};

const getDiffInMinutes = (start: number, end: number) => {
	const diff = end - start;
	return Math.floor(diff / (1000 * 60));
};
