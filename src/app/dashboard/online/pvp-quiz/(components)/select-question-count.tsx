import type { Dispatch, SetStateAction } from "react"
import { Field, FieldLabel, FieldSet } from "~/components/ui/field"
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
    <FieldSet>
      <Field>
        <FieldLabel htmlFor="multi-select-pvp-quiz">Liczba pytan</FieldLabel>
        <Select
          value={selectedQuestionCount.toString()}
          onValueChange={(newValue) => {
            setSelectedQuestionCount(parseInt(newValue))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder="Liczba pytan" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Liczba pytan</SelectLabel>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="15">15</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldSet>
  )
}
