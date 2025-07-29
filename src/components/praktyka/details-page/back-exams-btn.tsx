import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function BackToExams() {
  return (
    <Link
      href="/dashboard/egzamin-praktyczny"
      className="mb-6 inline-flex items-center hover:underline"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Exams
    </Link>
  );
}
