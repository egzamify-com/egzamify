import type { Doc } from "convex/_generated/dataModel"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { type Dispatch, type SetStateAction } from "react"
import type { OnboardingState } from "~/app/welcome/page"
import UpdateQualifications from "../settings/update-qualifications"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"

export default function UserQualifications({
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
          <h1>Wybierz swoje kwalifikacje</h1>
        </CardTitle>
        <CardDescription>
          <p>
            Wybierz kwalifikacje do których chcesz się przygotować, oczywiście w
            każdej chwili możesz je zmienić. Jeśli brakuje tu twojej
            kwalifikacji, daj nam znać{" "}
            <Link href={"/feedback"} className="text-foreground underline">
              tutaj.
            </Link>
          </p>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <UpdateQualifications {...{ user }} />
      </CardContent>
      <CardFooter className="flex w-full justify-between">
        <Button
          onClick={() => setCurrentStep("user-personal-details")}
          variant={"outline"}
        >
          <ArrowLeft />
          Wstecz
        </Button>
        <Button
          onClick={async () => setCurrentStep("completed")}
          variant={"outline"}
        >
          <ArrowRight />
          Dalej
        </Button>
      </CardFooter>
    </Card>
  )
}
