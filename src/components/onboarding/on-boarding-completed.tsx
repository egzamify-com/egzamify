import type { Dispatch, SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"

export default function OnBoardingCompleted({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
}) {
  return <div>completed</div>
}
