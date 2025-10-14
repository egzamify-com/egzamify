import PageHeaderWrapper from "~/components/page-header-wrapper"
import { UserExamItemSkeleton } from "~/components/praktyka/loadings"

export default function Loading() {
  return (
    <PageHeaderWrapper isPending={true}>
      <div className="flex flex-col gap-4">
        {[1, 2, 3, 4, 5].map((index) => (
          <UserExamItemSkeleton key={index} />
        ))}
      </div>
    </PageHeaderWrapper>
  )
}
