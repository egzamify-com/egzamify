import { api } from "convex/_generated/api"
import type { Id } from "convex/_generated/dataModel"
import { useQuery } from "convex/custom_helpers"
import type { ListPracticalExamsFilter } from "convex/praktyka/query"
import { Search } from "lucide-react"
import { useEffect, type Dispatch, type SetStateAction } from "react"
import useDebouncedSearch from "~/hooks/use-debounced-search"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"
import { FiltersSkeleton } from "./loadings"

export default function PracticalExamsFilters({
  setSearchInput,
  setSelectedQualificationId,
  setSelectedSort,
}: {
  setSearchInput: (value: string) => void
  setSelectedQualificationId: Dispatch<
    SetStateAction<Id<"qualifications"> | "wszystkie">
  >
  setSelectedSort: Dispatch<SetStateAction<"asc" | "desc">>
}) {
  const {
    isPending: searchIsPending,
    debouncedSearch,
    inputOnChange,
    search,
  } = useDebouncedSearch({
    time: 350,
  })
  const { data, isPending } = useQuery(api.teoria.query.getQualificationsList)
  const qualifications = data?.qualifications

  useEffect(() => {
    if (!searchIsPending) {
      setSearchInput(debouncedSearch)
    }
  }, [debouncedSearch, searchIsPending, setSearchInput])

  if (isPending) return <FiltersSkeleton />

  return (
    <div className="mb-8 rounded-lg">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="w-2/4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input
              placeholder="Wyszukaj kwalifikację..."
              className="pl-10"
              value={search}
              onChange={inputOnChange}
            />
          </div>
        </div>

        {qualifications && (
          <Select
            defaultValue="wszystkie"
            onValueChange={(e: ListPracticalExamsFilter["qualificationId"]) =>
              setSelectedQualificationId(e)
            }
          >
            <SelectTrigger className="w-1/4">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent className="max-w-3/4">
              <SelectItem value={"wszystkie"}>Wszystkie</SelectItem>
              {qualifications.map((qualification) => {
                if (qualification.baseExams.length === 0) return null
                return (
                  <SelectItem
                    key={crypto.randomUUID()}
                    value={qualification.id}
                  >
                    {qualification.label}
                  </SelectItem>
                )
              })}
            </SelectContent>
          </Select>
        )}

        <Select
          defaultValue="asc"
          onValueChange={(e: ListPracticalExamsFilter["sort"]) =>
            setSelectedSort(e)
          }
        >
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="asc">Nazwa A-Z</SelectItem>
            <SelectItem value="desc">Nazwa Z-A</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
