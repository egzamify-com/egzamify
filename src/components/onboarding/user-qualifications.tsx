import type { Dispatch, SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"
import { Button } from "../ui/button"

export default function UserQualifications({
  setCurrentStep,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
}) {
  return (
    <div>
      user qualifications
      <Button onClick={() => setCurrentStep("completed")}>next</Button>
    </div>
  )
}
