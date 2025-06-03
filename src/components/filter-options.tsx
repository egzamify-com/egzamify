"use client"

import { ChevronDown, Filter, X } from "lucide-react"
import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { Badge } from "~/components/ui/badge"

interface FilterOptionsProps {
  selectedCategories: string[]
  setSelectedCategories: (categories: string[]) => void
  selectedLevels: string[]
  setSelectedLevels: (levels: string[]) => void
}

export default function FilterOptions({
  selectedCategories,
  setSelectedCategories,
  selectedLevels,
  setSelectedLevels,
}: FilterOptionsProps) {
  const categories = ["Machine Learning", "Deep Learning", "NLP", "Computer Vision", "Reinforcement Learning"]
  const levels = ["Beginner", "Intermediate", "Advanced", "Expert"]

  const toggleCategory = (category: string) => {
    setSelectedCategories(
      selectedCategories.includes(category)
        ? selectedCategories.filter((c) => c !== category)
        : [...selectedCategories, category],
    )
  }

  const toggleLevel = (level: string) => {
    setSelectedLevels(
      selectedLevels.includes(level) ? selectedLevels.filter((l) => l !== level) : [...selectedLevels, level],
    )
  }

  const clearFilters = () => {
    setSelectedCategories([])
    setSelectedLevels([])
  }

  const activeFiltersCount = selectedCategories.length + selectedLevels.length

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
              {activeFiltersCount > 0 && (
                <Badge variant="secondary" className="ml-1 h-5 w-5 rounded-full p-0 flex items-center justify-center">
                  {activeFiltersCount}
                </Badge>
              )}
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            {categories.map((category) => (
              <DropdownMenuCheckboxItem
                key={category}
                checked={selectedCategories.includes(category)}
                onCheckedChange={() => toggleCategory(category)}
              >
                {category}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuLabel>Difficulty Level</DropdownMenuLabel>
            {levels.map((level) => (
              <DropdownMenuCheckboxItem
                key={level}
                checked={selectedLevels.includes(level)}
                onCheckedChange={() => toggleLevel(level)}
              >
                {level}
              </DropdownMenuCheckboxItem>
            ))}

            <DropdownMenuSeparator />

            <div className="p-2">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={clearFilters}
                disabled={activeFiltersCount === 0}
              >
                Clear Filters
              </Button>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCategories.map((category) => (
            <Badge key={category} variant="secondary" className="flex items-center gap-1">
              {category}
              <button onClick={() => toggleCategory(category)} className="ml-1 hover:bg-gray-200 rounded-full">
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
          {selectedLevels.map((level) => (
            <Badge key={level} variant="secondary" className="flex items-center gap-1">
              {level}
              <button onClick={() => toggleLevel(level)} className="ml-1 hover:bg-gray-200 rounded-full">
                <span className="sr-only">Remove</span>
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  )
}
