"use client"

import { api } from "convex/_generated/api"
import type { Doc, Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import { useMutation } from "convex/react"
import { RotateCcw, Save } from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { parseConvexError } from "~/lib/utils"
import SpinnerLoading from "../../spinner-loading"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
} from "../../ui/input-group"
import { Label } from "../../ui/label"
import { MultiSelect, type MultiSelectOption } from "../../ui/multi-select"
import { Skeleton } from "../../ui/skeleton"

function transformToOptions(
  qualifications: Doc<"qualifications">[],
): MultiSelectOption[] {
  return qualifications.map((qualification) => {
    return {
      value: qualification._id,
      label: `${qualification.name}`,
    }
  })
}
function transformToValues(qualifications: Doc<"qualifications">[]) {
  return qualifications.map((qualification) => qualification._id)
}
export default function UpdateQualifications({ user }: { user: Doc<"users"> }) {
  const { data, isPending, error } = useQuery(
    api.users.query.getSavedQualifications,
  )
  if (isPending) {
    return (
      <div className="w-full">
        <Skeleton className="h-9 w-full" />
      </div>
    )
  }

  if (error || !data) {
    console.error("[ERROR] Error while fetching qualifications - ", error)
    return (
      <div className="border-destructive w-full rounded-md border-1">
        <Skeleton className="flex h-9 w-full flex-col items-center justify-center">
          <p className="text-destructive">
            Wystąpił błąd podczas pobierania kwalifikacji
          </p>
        </Skeleton>
      </div>
    )
  }
  return (
    <Component
      {...{
        user,
        allQualifications: transformToOptions(data.allQualifications),
        userSavedQualifications: transformToValues(
          data.userSavedQualifications,
        ),
      }}
    />
  )
}

function Component({
  user,
  allQualifications,
  userSavedQualifications,
}: {
  user: Doc<"users">
  allQualifications: MultiSelectOption[]
  userSavedQualifications: string[]
}) {
  const updateUserProfile = useMutation(api.users.mutate.updateUserProfile)
  const [isMutating, setIsMutating] = useState(false)
  const [selectedValues, setSelectedValues] = useState<string[]>(
    userSavedQualifications,
  )

  async function handleUpdateQualifications() {
    try {
      setIsMutating(true)
      await updateUserProfile({
        newFields: {
          ...user,
          savedQualificationsIds: selectedValues as Id<"qualifications">[],
        },
      })
      setIsMutating(false)
      toast.success("Zapisano twoje kwalifikacje")
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
    <div className="flex flex-col gap-2">
      <InputGroup className="">
        <InputGroupAddon align={"inline-start"}>
          <Label className="whitespace-nowrap">Twoje Kwalifikacje</Label>
        </InputGroupAddon>
        <div className="w-full">
          <MultiSelect
            className="border-0 text-sm"
            options={allQualifications}
            onValueChange={setSelectedValues}
            defaultValue={selectedValues}
            hideSelectAll
            placeholder="Wybierz kwalifikacje"
          />
        </div>
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => setSelectedValues(userSavedQualifications)}
            disabled={isMutating || selectedValues === userSavedQualifications}
          >
            <RotateCcw /> Reset
          </InputGroupButton>
          <InputGroupButton
            variant={"default"}
            onClick={async () => await handleUpdateQualifications()}
            disabled={isMutating || selectedValues === userSavedQualifications}
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
    </div>
  )
}
