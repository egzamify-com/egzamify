import { BookOpen } from "lucide-react";

export default function PracticalExamHeader() {
  return (
    <div className="border-b">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold">Available Exams</h1>
            <p className="mt-1">Choose from our comprehensive exam catalog</p>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <BookOpen className="h-4 w-4" />
            {/* <span>{} exams available</span> */}
          </div>
        </div>
      </div>
    </div>
  );
}
