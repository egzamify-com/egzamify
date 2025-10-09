import type { Dispatch, SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"
import { Button } from "../ui/button"

export default function PersonalDetails({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
}) {
  return (
    <div>
      personla details (username){" "}
      <Button onClick={() => setCurrentStep("user-qualifications")}>
        next
      </Button>
    </div>
  )
}
