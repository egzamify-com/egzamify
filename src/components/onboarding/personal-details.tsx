import type { Doc } from "convex/_generated/dataModel"
import { ArrowLeft, ArrowRight } from "lucide-react"
import type { Dispatch, SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"
import UpdateUsername from "../settings/update-username"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function PersonalDetails({
  setCurrentStep,
  user,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
  user: Doc<"users">
}) {
  return (
    <Card className="w-2/5">
      <CardHeader>
        <CardTitle>
          <h1>Spersonalizuj swoją nazwę użytkownika</h1>
        </CardTitle>
        <CardDescription>
          <p>
            To twój unikalny pseudomin. Możesz ją zmienić w dowolnym momencie.
            Domyślny pseudomin jest generowany automatycznie na podstawie
            Twojego adresu email.
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateUsername {...{ user }} />
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Button onClick={() => setCurrentStep("welcome")} variant={"outline"}>
          <ArrowLeft />
          Wstecz
        </Button>
        <Button
          onClick={() => setCurrentStep("user-qualifications")}
          variant={"outline"}
        >
          <ArrowRight />
          Dalej
        </Button>
      </CardFooter>
    </Card>
  )
}
