import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { transformQualificationsToOptions } from "~/components/settings/update-qualifications"
import { Field, FieldLabel, FieldSet } from "~/components/ui/field"
import { MultiSelect } from "~/components/ui/multi-select"
import { Skeleton } from "~/components/ui/skeleton"

export default function SelectQualificationForPvpQuiz({
  selectedQualification,
  handleNewQualification,
}: {
  selectedQualification: string[]
  handleNewQualification: (newValue: string[]) => void
}) {
  const qualificationsQuery = useQuery(api.users.query.getSavedQualifications)
  const isQueryError =
    (qualificationsQuery.error || !qualificationsQuery.data) &&
    !qualificationsQuery.isPending

  return (
    <FieldSet>
      <Field>
        <FieldLabel htmlFor="multi-select-pvp-quiz">Kwalifikacja</FieldLabel>
        {qualificationsQuery.isPending && <Skeleton className="h-9 w-full" />}
        {isQueryError && (
          <div className="text-destructive">
            <p>{"Wystapił nieoczekiwany bład."}</p>
          </div>
        )}
        {!isQueryError && qualificationsQuery.data && (
          <MultiSelect
            className="bg-input/30 h-9 p-0"
            id="multi-select-pvp-quiz"
            singleSelect
            options={transformQualificationsToOptions(
              qualificationsQuery.data.allQualifications,
            )}
            onValueChange={handleNewQualification}
            value={selectedQualification}
            hideSelectAll
            placeholder="Wybierz kwalifikacje"
          />
        )}
      </Field>
    </FieldSet>
  )
}
