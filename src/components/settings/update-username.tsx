import { api } from "convex/_generated/api"
import type { Doc } from "convex/_generated/dataModel"
import { useMutation } from "convex/react"
import { RotateCcw, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import SpinnerLoading from "~/components/spinner-loading"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "~/components/ui/input-group"
import { Label } from "~/components/ui/label"
import { parseConvexError } from "~/lib/utils"

export default function UpdateUsername({ user }: { user: Doc<"users"> }) {
  const updateProfile = useMutation(api.users.mutate.updateUsername)
  const [isMutating, setIsMutating] = useState(false)
  const [newUsername, setNewUsername] = useState(user.username)
  return (
    <InputGroup>
      <InputGroupAddon align={"inline-start"}>
        <Label>Nazwa użytkownika</Label>
      </InputGroupAddon>
      <InputGroupInput
        placeholder=""
        value={newUsername}
        onChange={(e) => setNewUsername(e.target.value)}
      />
      <InputGroupAddon align="inline-end">
        <InputGroupButton onClick={() => setNewUsername(user.username)}>
          <RotateCcw /> Reset
        </InputGroupButton>
        <InputGroupButton
          variant={"default"}
          disabled={newUsername === user.username}
          onClick={async () => {
            try {
              if (!newUsername) throw new Error("Podaj nazwę użytkownika")
              setIsMutating(true)
              await updateProfile({ newUsername })
              setIsMutating(false)
              toast.success("Zmieniono nazwę użytkownika")
            } catch (error) {
              setIsMutating(false)
              const errMess = parseConvexError(error)
              console.error(`[ERROR] Failed to change username -  ${errMess}`)
              toast.error("Nie udało się zmienić nazwy użytkownika", {
                description: errMess,
              })
            }
          }}
        >
          {isMutating ? (
            <SpinnerLoading />
          ) : (
            <>
              <Save /> Zapisz
            </>
          )}
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  )
}
