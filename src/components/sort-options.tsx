"use client"

import { ArrowUpDown, ChevronDown } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"

interface SortOptionsProps {
  sortBy: string
  setSortBy: (sortBy: string) => void
}

export default function SortOptions({ sortBy, setSortBy }: SortOptionsProps) {
  const sortOptions = [
    { value: "title", label: "Title (A-Z)" },
    { value: "level", label: "Difficulty Level" },
    { value: "questionsCount", label: "Number of Questions" },
    { value: "releaseDate", label: "Release Date" },
    { value: "category", label: "Category" },
  ]

  const getCurrentSortLabel = () => {
    return sortOptions.find((option) => option.value === sortBy)?.label || "Sort by"
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 min-w-[160px] justify-between">
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="truncate">{getCurrentSortLabel()}</span>
          </div>
          <ChevronDown className="h-4 w-4 flex-shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuRadioGroup value={sortBy} onValueChange={setSortBy}>
          {sortOptions.map((option) => (
            <DropdownMenuRadioItem key={option.value} value={option.value}>
              {option.label}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
