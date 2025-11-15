import { Store } from "@tanstack/react-store"
import type { Id } from "convex/_generated/dataModel"

export const questionDialogStore = new Store(
  new Map<Id<"questions">, QuestionDialogValue>(),
)

type QuestionDialogValue = {
  isOpen: boolean
  explanation: string
  isPending: boolean
}

/**
 * Updates a specific question's dialog state (isOpen and explanation) in the store.
 * * @param questionId The ID of the question to update.
 * @param updates The new values for the isOpen and explanation properties.
 */
export function updateQuestionDialog(
  questionId: Id<"questions">,
  updates: Partial<QuestionDialogValue>, // Use Partial to allow updating only one field
) {
  questionDialogStore.setState((state) => {
    // 1. Get the current value for the key, or default to an empty object
    const currentValue = state.get(questionId) || {
      isOpen: false,
      explanation: "",
      isPending: false,
    }

    // 2. Create the new combined value by merging current state and updates
    const newValue: QuestionDialogValue = {
      ...currentValue,
      ...updates,
    }

    // 3. Create a shallow copy of the Map (the immutable step)
    const newMap = new Map(state)

    // 4. Set the updated value on the new Map
    newMap.set(questionId, newValue)

    // 5. Return the new Map to update the store
    return newMap
  })
}
