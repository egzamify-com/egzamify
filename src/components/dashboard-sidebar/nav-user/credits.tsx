import { CircleDollarSign } from "lucide-react"
import GetCreditsBtn from "~/components/landing-page/get-credits-btn"
import { CardHeader } from "~/components/ui/card"

export default function Credits({
  userCredits,
}: {
  userCredits: number | undefined
}) {
  return (
    <CardHeader className="flex flex-row items-center justify-between p-0">
      <div className="flex flex-row items-center gap-1">
        <CircleDollarSign size={20} />
        <p>{userCredits ?? 0}</p>
      </div>
      <GetCreditsBtn />
    </CardHeader>
  )
}
