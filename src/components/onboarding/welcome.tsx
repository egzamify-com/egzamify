import { ArrowRight } from "lucide-react"
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
      <Button
        onClick={() => setCurrentStep("user-personal-details")}
        variant={"outline"}
      >
        <ArrowRight />
        Skonfiguruj moje konto
      </Button>
    </div>
  )
}
