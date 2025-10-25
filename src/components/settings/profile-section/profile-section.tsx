import type { Doc } from "convex/_generated/dataModel"
import { User } from "lucide-react"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import UpdateQualifications from "./update-qualifications"
import UpdateUsername from "./update-username"

export default function ProfileSection({ user }: { user: Doc<"users"> }) {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User size={22} />
          <h1 className="text-xl">Profil</h1>
        </CardTitle>
        <CardDescription>
          Zaktualizuj informacje o swoim profilu.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Separator />
        <UpdateUsername {...{ user }} />
        <Separator />
        <UpdateQualifications {...{ user }} />
      </CardContent>
    </Card>
  )
}
