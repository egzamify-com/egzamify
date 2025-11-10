import type { Dispatch, SetStateAction } from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select"

export default function SelectQuestionCount({
  selectedQuestionCount,
  setSelectedQuestionCount,
}: {
  selectedQuestionCount: number
  setSelectedQuestionCount: Dispatch<SetStateAction<number>>
}) {
  return (
    <>
      <Select
        value={selectedQuestionCount.toString()}
        onValueChange={(newValue) => {
          setSelectedQuestionCount(parseInt(newValue))
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Question Count" />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            <SelectLabel>Count</SelectLabel>
            <SelectItem value="5">5</SelectItem>
            <SelectItem value="10">10</SelectItem>
          </SelectGroup>
        </SelectContent>
      </Select>
    </>
  )
}
