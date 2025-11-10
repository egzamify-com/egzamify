import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { transformQualificationsToOptions } from "~/components/settings/update-qualifications"
import SpinnerLoading from "~/components/spinner-loading"
import { MultiSelect } from "~/components/ui/multi-select"

export default function SelectQualificationForPvpQuiz({
  selectedQualification,
  handleNewQualification,
}: {
  selectedQualification: string[]
  handleNewQualification: (newValue: string[]) => void
}) {
  const qualificationsQuery = useQuery(api.users.query.getSavedQualifications)
  if (qualificationsQuery.isPending) {
    return <SpinnerLoading />
  }
  if (qualificationsQuery.error || !qualificationsQuery.data) {
    return <div>error with qualifications</div>
  }
  return (
    <MultiSelect
      singleSelect
      className="border-0 text-sm"
      options={transformQualificationsToOptions(
        qualificationsQuery.data.allQualifications,
      )}
      onValueChange={handleNewQualification}
      value={selectedQualification}
      hideSelectAll
      placeholder="Wybierz kwalifikacje"
    />
  )
}
