import { Search } from "lucide-react"
import { Input } from "../ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select"

export default function PracticalExamsFilters() {
  return (
    <div className="mb-8 rounded-lg">
      <div className="flex flex-col gap-4 lg:flex-row">
        {/* Search */}
        <div className="w-2/4">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
            <Input placeholder="Search exams..." className="pl-10" />
          </div>
        </div>

        {/* Category Filter */}
        <Select>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="technology">Technology</SelectItem>
            <SelectItem value="business">Business</SelectItem>
            <SelectItem value="design">Design</SelectItem>
            <SelectItem value="marketing">Marketing</SelectItem>
            <SelectItem value="mathematics">Mathematics</SelectItem>
          </SelectContent>
        </Select>

        {/* Sort */}
        <Select>
          <SelectTrigger className="w-1/4">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="date">Exam Date</SelectItem>
            <SelectItem value="title">Title A-Z</SelectItem>
            <SelectItem value="difficulty">Difficulty</SelectItem>
            <SelectItem value="participants">Popularity</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )
}
