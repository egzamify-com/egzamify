import type { api } from "convex/_generated/api";
import type { PaginatedQueryItem } from "convex/react";
import Link from "next/link";
import UserExamBadges from "./user-exam-badges";

export default function UserExamCard({
  userExam,
}: {
  userExam: PaginatedQueryItem<typeof api.praktyka.query.listUserExams>;
}) {
  return (
    <Link href={`/dashboard/egzamin-praktyczny/historia/${userExam._id}`}>
      <div className="hover:bg-card flex w-full cursor-pointer items-center justify-between overflow-hidden rounded-lg border border-b p-4 text-left shadow-sm transition-colors">
        <div className="flex flex-col items-start justify-center gap-2">
          <h3 className="text-lg font-semibold">
            {userExam.baseExam.qualification?.label}
          </h3>
          <UserExamBadges {...{ userExam }} />
        </div>
      </div>
    </Link>
  );
}
