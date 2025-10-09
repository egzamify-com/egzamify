import type { Dispatch, SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"
import { Button } from "../ui/button"

export default function Welcome({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
}) {
  return (
    <div>
      welcome{" "}
      <Button onClick={() => setCurrentStep("user-personal-details")}>
        go next
      </Button>{" "}
    </div>
  )
}
