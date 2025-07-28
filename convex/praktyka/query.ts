import { paginationOptsValidator } from "convex/server";
import { query } from "../_generated/server";
export const listPracticalExams = query({
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, { paginationOpts }) => {
    const exams = await ctx.db
      .query("basePracticalExams")
      .paginate(paginationOpts);

    const examsWithQualifications = await Promise.all(
      exams.page.map(async (exam) => ({
        ...exam,
        qualification: await ctx.db.get(exam.qualificationId),
      })),
    );

    // const keys = Object.keys(grouped);

    // for (const id of keys) {
    //   console.log("grouped - id", id);
    // }
    return {
      ...exams,
      page: examsWithQualifications,
    };
  },
});
