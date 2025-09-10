import { v } from "convex/values";
import { query } from "../_generated/server";

export const getTheoryUsers = query({
  handler: async (ctx) => {
    const users = await ctx.db.query("users_theory").collect();
    return { users };
  },
});

export const getTheoryUserByEmail = query({
  args: { email: v.string() },
  handler: async (ctx, args) => {
    const user = await ctx.db
      .query("users_theory")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();
    return user;
  },
});

export const getQualificationsList = query({
  handler: async (ctx) => {
    const qualifications = await ctx.db.query("qualifications").collect();

    const qualificationsWithQuestions = await Promise.all(
      qualifications.map(async (qualification) => {
        const questions = await ctx.db
          .query("questions")
          .withIndex("by_qualification", (q) =>
            q.eq("qualification_id", qualification._id),
          )
          .collect();

        return {
          id: qualification._id,
          name: qualification.name,
          label: qualification.label,
          created_at: qualification.created_at || Date.now(),
          questionsCount: questions.length,
        };
      }),
    );

    return {
      qualifications: qualificationsWithQuestions,
    };
  },
});

export const getQuestionsByQualification = query({
  args: { qualificationId: v.id("qualifications") },
  handler: async (ctx, args) => {
    const { qualificationId } = args;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualification_id", qualificationId),
      )
      .collect();

    const questionsWithAnswers = await Promise.all(
      questions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("question_id", question._id))
          .collect();

        // Sortuj odpowiedzi według label
        const sortedAnswers = answers.sort((a, b) =>
          a.label.localeCompare(b.label),
        );

        return {
          id: question._id,
          question: question.content,
          answers: sortedAnswers.map((answer) => answer.content),
          correctAnswer: sortedAnswers.findIndex((answer) => answer.is_correct),
          explanation: question.explanation,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: sortedAnswers.map((answer) => answer.label),
        };
      }),
    );

    // Sortuj pytania według daty utworzenia
    questionsWithAnswers.sort((a, b) => {
      const aTime = questions.find((q) => q._id === a.id)?.created_at || 0;
      const bTime = questions.find((q) => q._id === b.id)?.created_at || 0;
      return aTime - bTime;
    });

    return {
      questions: questionsWithAnswers,
    };
  },
});

export const getRandomQuestion = query({
  args: {
    qualificationId: v.id("qualifications"),
    _refreshKey: v.optional(v.number()), // Parametr do wymuszania nowego zapytania
  },
  handler: async (ctx, args) => {
    const { qualificationId } = args;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualification_id", qualificationId),
      )
      .collect();

    if (questions.length === 0) {
      return { question: null };
    }

    // Wybierz losowe pytanie
    const randomIndex = Math.floor(Math.random() * questions.length);
    const randomQuestion = questions[randomIndex];

    // DODAJ SPRAWDZENIE - to rozwiąże błąd TypeScript
    if (!randomQuestion) {
      return { question: null };
    }

    const answers = await ctx.db
      .query("answers")
      .withIndex("by_question", (q) => q.eq("question_id", randomQuestion._id))
      .collect();

    // Sortuj odpowiedzi według label
    const sortedAnswers = answers.sort((a, b) =>
      a.label.localeCompare(b.label),
    );

    return {
      question: {
        id: randomQuestion._id,
        question: randomQuestion.content,
        answers: sortedAnswers.map((answer) => answer.content),
        correctAnswer: sortedAnswers.findIndex((answer) => answer.is_correct),
        explanation: randomQuestion.explanation,
        year: randomQuestion.year,
        imageUrl: randomQuestion.image_url,
        answerLabels: sortedAnswers.map((answer) => answer.label),
      },
    };
  },
});

export const getBrowseQuestions = query({
  args: {
    qualificationId: v.id("qualifications"),
    search: v.optional(v.string()),
    year: v.optional(v.number()),
    limit: v.optional(v.number()),
    offset: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { qualificationId, search, year, limit = 50, offset = 0 } = args;

    let questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualification_id", qualificationId),
      )
      .collect();

    // Filtruj po roku jeśli podano
    if (year) {
      questions = questions.filter((q) => q.year === year);
    }

    // Filtruj po tekście jeśli podano
    if (search && search.trim() !== "") {
      const searchLower = search.toLowerCase();
      questions = questions.filter((q) =>
        q.content.toLowerCase().includes(searchLower),
      );
    }

    // Sortuj według daty utworzenia (najnowsze pierwsze)
    questions.sort((a, b) => (b.created_at || 0) - (a.created_at || 0));

    // Paginacja
    const paginatedQuestions = questions.slice(offset, offset + limit);

    const questionsWithAnswers = await Promise.all(
      paginatedQuestions.map(async (question) => {
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("question_id", question._id))
          .collect();

        // Sortuj odpowiedzi według label
        const sortedAnswers = answers.sort((a, b) =>
          a.label.localeCompare(b.label),
        );

        return {
          id: question._id,
          question: question.content,
          answers: sortedAnswers.map((answer) => answer.content),
          correctAnswer: sortedAnswers.findIndex((answer) => answer.is_correct),
          explanation: question.explanation,
          year: question.year,
          imageUrl: question.image_url,
          answerLabels: sortedAnswers.map((answer) => answer.label),
          category: `Rok ${question.year}`,
          difficulty: "Średni",
        };
      }),
    );

    return {
      questions: questionsWithAnswers,
      total: questions.length,
    };
  },
});

export const getQuestionsStats = query({
  args: { qualificationId: v.id("qualifications") },
  handler: async (ctx, args) => {
    const { qualificationId } = args;

    const questions = await ctx.db
      .query("questions")
      .withIndex("by_qualification", (q) =>
        q.eq("qualification_id", qualificationId),
      )
      .collect();

    const years = [...new Set(questions.map((q) => q.year))].sort(
      (a, b) => b - a,
    );

    return {
      total: questions.length,
      years,
    };
  },
});
