import type { Doc } from "convex/_generated/dataModel"
import { ConvexError, v } from "convex/values"
import { mutation } from "../_generated/server"
import { getUserIdOrThrow, getUserProfileOrThrow } from "../custom_helpers"
import { vv } from "../schema"
import {
  authUserToAccessQuizOrThrow,
  calcQuizScore,
  calcQuizTime,
  calcQuizWinner,
  getQuizOrThrow,
  getRandomQuestionsIds,
  insertQuizAnswers,
  quizGameStateValidator,
} from "./helpers"

export const createPvpQuiz = mutation({
  args: {
    opponentUserId: v.id("users"),
    quizQualificationId: v.id("qualifications"),
    questionCount: v.number(),
  },
  handler: async (
    ctx,
    { opponentUserId, quizQualificationId, questionCount },
  ) => {
    const user = await getUserProfileOrThrow(ctx)

    const randomQuizQuestionsIds = await getRandomQuestionsIds(
      quizQualificationId,
      questionCount,
      ctx,
    )

    const quizId = await ctx.db.insert("pvpQuizzes", {
      status: "waiting_for_oponent_accept",
      opponentUserId,
      creatorUserId: user._id,
      quizQualificationId,
      quizQuestionsIds: randomQuizQuestionsIds,
    })

    return quizId.toString()
  },
})

export const submitQuiz = mutation({
  args: { quizId: v.id("pvpQuizzes"), quizGameState: quizGameStateValidator },
  handler: async (ctx, { quizId, quizGameState }) => {
    const currentUserId = await getUserIdOrThrow(ctx)

    const quiz = await getQuizOrThrow(ctx, quizId)

    await authUserToAccessQuizOrThrow(currentUserId, quiz)

    const submittedAt = Date.now()

    const allUserAnswersIds = await insertQuizAnswers(
      ctx,
      quizGameState,
      currentUserId,
    )

    const isCurrentUserQuizCreator = currentUserId === quiz.creatorUserId
    console.log({ isCurrentUserQuizCreator })

    const newPlayerData: Doc<"pvpQuizzes">["creatorData"] = {
      submittedAt: Date.now(),
      status: "done",
      answersIds: allUserAnswersIds,
      score: calcQuizScore(quizGameState),
    }

    if (isCurrentUserQuizCreator) {
      await ctx.db.patch(quizId, {
        creatorData: {
          ...newPlayerData,
          time: calcQuizTime(quiz.creatorData?.startedAt, submittedAt),
        },
      })
    } else {
      await ctx.db.patch(quizId, {
        opponentData: {
          ...newPlayerData,
          time: calcQuizTime(quiz.opponentData?.startedAt, submittedAt),
        },
      })
    }

    const updatedQuizState = await getQuizOrThrow(ctx, quizId)

    const isQuizCompletedByBothUsers =
      updatedQuizState.creatorData?.status === "done" &&
      updatedQuizState.opponentData?.status === "done"

    if (!isQuizCompletedByBothUsers) {
      console.log("quiz is not completed by both users, going next")
      return
    }
    console.log(
      "both creator and opp data status is set to done, here should set quiz to completed, and calc winner",
    )

    const { winnerUserId, winnerType } = calcQuizWinner(updatedQuizState)

    await ctx.db.patch(quizId, {
      status: "quiz_completed",
      winnerUserId,
      winnerType,
    })
  },
})

export const updateQuizStatus = mutation({
  args: {
    quizId: v.id("pvpQuizzes"),
    newStatus: vv.doc("pvpQuizzes").fields.status,
  },
  handler: async (ctx, { quizId, newStatus }) => {
    const quiz = await ctx.db.get(quizId)
    if (!quiz) {
      console.error("Nie znaleziono quizu")
      throw new ConvexError("Nie znaleziono quizu")
    }

    authUserToAccessQuizOrThrow(await getUserIdOrThrow(ctx), quiz)

    const startedAt = Date.now()

    if (newStatus === "quiz_pending") {
      await ctx.db.patch(quiz._id, {
        status: newStatus,
        creatorData: { ...quiz.creatorData, startedAt },
        opponentData: { ...quiz.opponentData, startedAt },
      })
      return
    }

    await ctx.db.patch(quiz._id, { status: newStatus })
  },
})

export const deleteQuiz = mutation({
  args: { quizId: v.id("pvpQuizzes") },
  handler: async (ctx, { quizId }) => {
    const quiz = await getQuizOrThrow(ctx, quizId)
    authUserToAccessQuizOrThrow(await getUserIdOrThrow(ctx), quiz)

    await ctx.db.delete(quizId)
  },
})
