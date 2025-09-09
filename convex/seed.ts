// import { v } from "convex/values";
// import type { Id } from "./_generated/dataModel";
// import { mutation } from "./_generated/server";

// // --- Data to be inserted ---
// // We will insert the questions first, then the answers, so we need to
// // link them using a simple convention for now.
// const questionsData = [
//   {
//     content:
//       "Wskaż znacznik HTML pozwalający na zapisanie tekstu nieprawidłowego lub nieodpowiedniego w sposób przekreślony.",
//     year: 2024,
//   },
//   {
//     content:
//       'Element <meta charset="utf-8"> jest stosowany do określenia metadanych strony internetowej dotyczących',
//     year: 2024,
//   },
//   {
//     content: "W języku HTML zdefiniowano listę, która",
//     year: 2024,
//   },
//   {
//     content:
//       "W kaskadowych arkuszach stylów selektor klasy należy zdefiniować za pomocą symbolu",
//     year: 2024,
//   },
// ];

// const answersData = [
//   // Answers for Question 1
//   { content: "<s> </s>", is_correct: true, label: "A" },
//   { content: "<b> </b>", is_correct: false, label: "B" },
//   { content: "<em> </em>", is_correct: false, label: "C" },
//   { content: "<sub> </sub>", is_correct: false, label: "D" },
//   // Answers for Question 2
//   { content: "opisu strony.", is_correct: false, label: "A" },
//   { content: "języka strony.", is_correct: false, label: "B" },
//   { content: "słów kluczowych.", is_correct: false, label: "C" },
//   { content: "kodowania znaków.", is_correct: true, label: "D" },
//   // Answers for Question 3
//   {
//     content: "jest punktowana z zagłębioną listą numerowaną.",
//     is_correct: false,
//     label: "A",
//   },
//   {
//     content: "jest numerowana z zagłębioną listą punktowaną.",
//     is_correct: true,
//     label: "B",
//   },
//   {
//     content: "nie ma zagłębień i jest punktowana, wyświetla 5 punktów.",
//     is_correct: false,
//     label: "C",
//   },
//   {
//     content:
//       "nie ma zagłębień i jest numerowana, słowo „niebieski” ma przyporządkowany numer 5.",
//     is_correct: false,
//     label: "D",
//   },
//   // Answers for Question 4
//   { content: "*", is_correct: false, label: "A" },
//   { content: "#", is_correct: false, label: "B" },
//   { content: ". (kropka)", is_correct: true, label: "C" },
//   { content: ": (dwukropek)", is_correct: false, label: "D" },
// ];

// export const seedQuestionsAndAnswers = mutation({
//   args: {
//     qualificationId: v.id("qualifications"),
//   },
//   handler: async (ctx, args) => {
//     // A map to store the new question IDs
//     const questionIds: Id<"questions">[] = [];

//     // Step 1: Insert all questions and store their IDs
//     for (const question of questionsData) {
//       const questionId = await ctx.db.insert("questions", {
//         qualification_id: args.qualificationId,
//         content: question.content,
//         year: question.year,
//         image_url: "", // Since the images are empty, we can set this to null.
//         explanation: "",
//       });
//       questionIds.push(questionId);
//     }

//     // Step 2: Loop through answers and insert them with the correct question_id
//     // We assume 4 answers per question based on the provided data.
//     let answerIndex = 0;
//     for (const questionId of questionIds) {
//       // Loop for the 4 answers belonging to the current question
//       for (let i = 0; i < 4; i++) {
//         const answer = answersData[answerIndex];
//         await ctx.db.insert("answers", {
//           question_id: questionId,
//           content: answer!.content,
//           image_url: "",
//           is_correct: answer!.is_correct,
//           label: answer!.label,
//         });
//         answerIndex++;
//       }
//     }
//   },
// });
import { v } from "convex/values";
import type { Id } from "./_generated/dataModel";
import { mutation } from "./_generated/server";

export const seedQuestionsAndAnswers = mutation({
  args: {
    qualificationId: v.id("qualifications"),
    questions: v.array(
      v.object({
        content: v.string(),
        year: v.number(),
      }),
    ),
    answers: v.array(
      v.object({
        content: v.string(),
        is_correct: v.boolean(),
        label: v.string(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    // A map to store the new question IDs
    const questionIds: Id<"questions">[] = [];

    // Step 1: Insert all questions and store their IDs
    for (const question of args.questions) {
      const questionId = await ctx.db.insert("questions", {
        qualification_id: args.qualificationId,
        content: question.content,
        year: question.year,
        image_url: "", // Still assuming no images in this data set
        explanation: "",
      });
      questionIds.push(questionId);
    }

    // Step 2: Loop through answers and insert them with the correct question_id
    // We assume there are 4 answers for each question based on the data structure
    let answerIndex = 0;
    for (const questionId of questionIds) {
      // Loop for the 4 answers belonging to the current question
      for (let i = 0; i < 4; i++) {
        const answer = args.answers[answerIndex];
        if (!answer) return;
        await ctx.db.insert("answers", {
          question_id: questionId,
          content: answer.content,
          image_url: "",
          is_correct: answer.is_correct,
          label: answer.label,
        });
        answerIndex++;
      }
    }
  },
});
