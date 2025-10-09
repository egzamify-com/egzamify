import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import type { FunctionReturnType } from "convex/server"
import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"
import { useState, type Dispatch, type SetStateAction } from "react"
import { toast } from "sonner"
import type { OnboardingState } from "~/app/welcome/page"
import { parseConvexError } from "~/lib/utils"
import FullScreenError from "../full-screen-error"
import SpinnerLoading from "../SpinnerLoading"
import { Button } from "../ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { MultiSelect } from "../ui/multi-select"
const options = [
  { value: "react", label: "React" },
  { value: "vue", label: "Vue.js" },
  { value: "angular", label: "Angular" },
]
function transformQualifications(
  qualifications: FunctionReturnType<
    typeof api.teoria.query.getQualificationsList
  >,
) {
  return qualifications.qualifications.map((qualification) => {
    return {
      value: qualification.id,
      label: `${qualification.name}`,
    }
  })
}

export default function UserQualifications({
  setCurrentStep,
  user,
}: {
  setCurrentStep: Dispatch<SetStateAction<OnboardingState>>
  user: Doc<"users">
}) {
  const updateUserProfile = useMutation(api.users.mutate.updateUserProfile)
  const [isMutating, setIsMutating] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>([])
  const { data, isPending, error } = useQuery(
    api.teoria.query.getQualificationsList,
  )
  if (isPending) return <SpinnerLoading />
  if (error || !data) {
    console.error("[ERROR] Error while fetching qualifications - ", error)
    return (
      <FullScreenError errorMessage="Wystąpił nieoczekiwany błąd, przepraszamy." />
    )
  }
  async function handleUpdateQualifications() {
    try {
      setIsMutating(true)
      await updateUserProfile({
        newFields: {
          ...user,
          preferredQualificationsIds: selectedValues as Id<"qualifications">[],
        },
      })
      setIsMutating(false)
      toast.success("Zapisano twoje kwalifikacje")
      setCurrentStep("completed")
    } catch (error) {
      setIsMutating(false)
      const errMess = parseConvexError(error)
      console.error("[ERROR] Error while setting current step - ", error)
      toast.error("Nie udało się ustawić kwalifikacji", {
        description: errMess,
      })
    }
  }
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
        <MultiSelect
          options={transformQualifications(data)}
          onValueChange={setSelectedValues}
          defaultValue={selectedValues}
          hideSelectAll
          placeholder="Wybierz kwalifikacje"
        />
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
          onClick={async () => await handleUpdateQualifications()}
          variant={"outline"}
        >
          {isMutating ? (
            <SpinnerLoading />
          ) : (
            <>
              <ArrowRight />
              Dalej
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  )
}
