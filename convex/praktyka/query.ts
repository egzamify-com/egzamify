import { getPage } from "convex-helpers/server/pagination";
import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";

export const listPracticalExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    // Use getPage to fetch a page of exams
    const { page, ...rest } = await getPage(ctx, {
      table: "basePracticalExams",
      ...paginationOpts,
    });

    // Enrich each exam with qualification data
    const examsWithQualificationData = await Promise.all(
      page.map(async (exam) => {
        const qualification = await ctx.db.get(exam.qualificationId);
        return {
          ...exam,
          qualification,
        };
      }),
    );

    // Return the paginated structure with the enriched page
    return {
      page: examsWithQualificationData,
      ...rest,
    };
  },
});
