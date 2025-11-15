import type { Dispatch, SetStateAction } from "react"
import { APP_CONFIG } from "~/APP_CONFIG"
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
        <FieldLabel htmlFor="multi-select-pvp-quiz">
          {"Liczba pytań"}
        </FieldLabel>
        <Select
          value={selectedQuestionCount.toString()}
          onValueChange={(newValue) => {
            setSelectedQuestionCount(parseInt(newValue))
          }}
        >
          <SelectTrigger>
            <SelectValue placeholder={"Liczba pytań"} />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>{"Liczba pytań"}</SelectLabel>
              {APP_CONFIG.onlinePvpQuiz.questionCountOptions.map((count) => {
                return (
                  <SelectItem
                    key={crypto.randomUUID()}
                    value={count.toString()}
                  >
                    {count}
                  </SelectItem>
                )
              })}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
    </FieldSet>
  )
}
