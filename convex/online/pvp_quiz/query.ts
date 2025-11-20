import { asyncMap } from "convex-helpers"
import { ConvexError, v, type Infer } from "convex/values"
import { query, type QueryCtx } from "../../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../../custom_helpers"
import { vv } from "../../schema"
import { authUserToAccessQuizOrThrow, getQuizOrThrow } from "./helpers"

export const getPvpQuiz = query({
  args: { pvpQuizId: v.id("pvpQuizzes") },
  handler: async (ctx, { pvpQuizId }) => {
    const currentUserId = await getUserIdOrThrow(ctx)

    const quiz = await ctx.db.get(pvpQuizId)

    if (!quiz) {
      const errMessage = "Nie znaleziono quizu"
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    await authUserToAccessQuizOrThrow(currentUserId, quiz)

    const creatorUser = await ctx.db.get(quiz.creatorUserId)
    const opponentUser = await ctx.db.get(quiz.opponentUserId)

    if (!creatorUser || !opponentUser) {
      const errMessage = "Nie znaleziono profilu uczestnika quizu!"
      console.error("Creator Id - ", quiz.creatorUserId)
      console.error("Opponent Id - ", quiz.opponentUserId)
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }

    const quizQuestions = await asyncMap(
      quiz.quizQuestionsIds,
      async (questionId) => {
        const question = await ctx.db.get(questionId)
        if (!question) return null
        const answers = await ctx.db
          .query("answers")
          .withIndex("by_question", (q) => q.eq("questionId", questionId))
          .collect()
        return {
          ...question,
          answers,
        }
      },
    )

    const quizQualification = await ctx.db.get(quiz.quizQualificationId)

    return {
      ...quiz,
      quizQuestions: quizQuestions.filter((a) => a !== null),
      quizQualification,
      creatorUser,
      opponentUser,
    }
  },
})

export const getQuizUsers = query({
  args: { quizId: v.id("pvpQuizzes") },
  handler: async (ctx, { quizId }) => {
    const quiz = await getQuizOrThrow(ctx, quizId)
    const creatorUser = await ctx.db.get(quiz.creatorUserId)
    const opponentUser = await ctx.db.get(quiz.opponentUserId)

    if (!creatorUser || !opponentUser) {
      const errMessage = "Nie znaleziono profilu uczestnika quizu!"
      console.error("Creator Id - ", quiz.creatorUserId)
      console.error("Opponent Id - ", quiz.opponentUserId)
      console.error(errMessage)
      throw new ConvexError(errMessage)
    }
    return { creatorUser, opponentUser }
  },
})

export const getUsersFromQuiz = query({
  args: { quizId: v.id("pvpQuizzes") },
  handler: async (ctx, { quizId }) => {
    const currentUser = await getUserProfileOrThrow(ctx)

    const quiz = await getQuizOrThrow(ctx, quizId)

    const winnerUserId = quiz.winnerUserId
    if (!winnerUserId) {
      const errMess = "Nie udalo sie znalesc zwyciezcy!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const winnerUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", winnerUserId))
      .first()

    if (!winnerUser) {
      const errMess = "Nie znaleziono uzytkownika zwyciezcy!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const opponentUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", quiz.opponentUserId))
      .first()

    if (!opponentUser) {
      const errMess = "Nie znaleziono uzytkownika przeciwnika !"
      console.error(errMess)
      throw new ConvexError(errMess)
    }

    const creatorUser = await ctx.db
      .query("users")
      .withIndex("by_id", (q) => q.eq("_id", quiz.creatorUserId))
      .first()

    if (!creatorUser) {
      const errMess = "Nie znaleziono uzytkownika tworcy quizu!"
      console.error(errMess)
      throw new ConvexError(errMess)
    }
    return { currentUser, winnerUser, creatorUser, opponentUser }
  },
})

export const getAnswersFromIdArray = query({
  args: { userAnswersIds: v.array(v.id("userAnswers")) },
  handler: async (ctx, { userAnswersIds }) => {
    const answers = await asyncMap(userAnswersIds, async (userAnswerId) => {
      const userAnswer = await ctx.db.get(userAnswerId)
      if (!userAnswer) return null
      const originalAnswer = await ctx.db.get(userAnswer.questionId)
      if (!originalAnswer) return null
      return { userAnswer, originalAnswer }
    })
    return answers
  },
})

export const getOnlineInvites = query({
  handler: async (ctx) => {
    const currentUserId = await getUserIdOrThrow(ctx)
    const pendingQuizzes = await ctx.db
      .query("pvpQuizzes")
      .withIndex("by_status", (q) =>
        q.eq("status", "waiting_for_oponent_accept"),
      )
      .order("desc")
      .collect()

    const quizzes = await asyncMap(pendingQuizzes, async (quiz) => {
      return {
        ...quiz,
        quizQualification: await ctx.db.get(quiz.quizQualificationId),
      }
    })

    return quizzes
      .filter((a) => {
        if (a.creatorUserId === currentUserId) {
          return null
        }
        return a
      })
      .filter((a) => a !== null)
  },
})

export const getAnswersFromUserAnswers = query({
  args: {
    currentUserAnswersIds: v.optional(v.array(v.id("userAnswers"))),
    otherUserAnswersIds: v.optional(v.array(v.id("userAnswers"))),
  },
  handler: async (ctx, { currentUserAnswersIds, otherUserAnswersIds }) => {
    if (!currentUserAnswersIds || !otherUserAnswersIds) return null

    const currentUsers = await asyncMap(
      currentUserAnswersIds,
      async (userAnswerId) => {
        const userAnswer = await ctx.db.get(userAnswerId)
        if (!userAnswer) return null
        const answer = await ctx.db.get(userAnswer.answerId)
        if (!answer) return null
        return {
          userAnswer,
          answer,
        }
      },
    )

    const otherUsers = await asyncMap(
      otherUserAnswersIds,
      async (userAnswerId) => {
        const userAnswer = await ctx.db.get(userAnswerId)
        if (!userAnswer) return null
        const answer = await ctx.db.get(userAnswer.answerId)
        if (!answer) return null
        const user = await ctx.db.get(userAnswer.userId)
        if (!user) return null
        return {
          answer,
          userAnswer,
          user,
        }
      },
    )
    return {
      currentUsers: currentUsers.filter((a) => a !== null),
      otherUsers: otherUsers.filter((a) => a !== null),
    }
  },
})

const userAnswersData = v.object({
  userAnswersIds: v.optional(v.array(v.id("userAnswers"))),
  userProfile: v.optional(vv.doc("users")),
})

const parseUsersAnswersIdsValidator = v.object({
  currentUserAnswersIds: v.optional(v.array(userAnswersData)),
  otherUsersAnswersIds: v.optional(v.array(userAnswersData)),
})

export const parseUsersAnswersIds = query({
  args: parseUsersAnswersIdsValidator,
  handler: async (ctx, { currentUserAnswersIds, otherUsersAnswersIds }) => {
    if (!currentUserAnswersIds) return null
    if (!otherUsersAnswersIds) return null

    const currentUserData = await getAnswerDataForUsers(
      ctx,
      currentUserAnswersIds,
    )

    const otherUsersAnswersData = await getAnswerDataForUsers(
      ctx,
      otherUsersAnswersIds,
    )

    return {
      currentUserData,
      otherUsersAnswersData,
    }
  },
})

async function getAnswerDataForUsers(
  ctx: QueryCtx,
  data: Infer<typeof userAnswersData>[],
) {
  const wholeList = await asyncMap(data, async (itemForUser) => {
    if (!itemForUser) return
    if (!itemForUser.userAnswersIds) return
    const dataForUser = await asyncMap(
      itemForUser.userAnswersIds,
      async (answerIdForUser) => {
        const userAnswerDoc = await ctx.db.get(answerIdForUser)
        if (!userAnswerDoc) return null

        const answerDoc = await ctx.db.get(userAnswerDoc.answerId)
        if (!answerDoc) return null

        return {
          userAnswerDoc,
          answerDoc,
        }
      },
    )

    const withoutNulls = dataForUser.filter((a) => a !== null)
    return {
      userProfile: itemForUser.userProfile,
      userAnswerData: withoutNulls,
    }
  })

  const mainDataWithoutNulls = wholeList.filter((a) => a !== undefined)
  return mainDataWithoutNulls
}
