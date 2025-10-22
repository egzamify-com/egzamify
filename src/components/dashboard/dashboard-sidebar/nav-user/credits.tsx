import { Gem } from "lucide-react"
import GetCreditsBtn from "~/components/landing-page/get-credits-btn"
import { Button } from "~/components/ui/button"
import { CardHeader } from "~/components/ui/card"

export default function Credits({
  userCredits,
}: {
  userCredits: number | undefined
}) {
  return (
    <CardHeader className="flex flex-row items-center justify-start p-0">
      <div className="w-full">
        <GetCreditsBtn className="w-full" />
      </div>
      <Button variant={"outline"} className="cursor-default">
        <div className="flex flex-row items-center gap-1">
          <Gem size={15} />
          <p className="text-md">{userCredits ?? 0} </p>
        </div>
      </Button>
    </CardHeader>
  )
}
