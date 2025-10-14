import PageHeaderWrapper from "~/components/page-header-wrapper"
import EnhancedExamSkeleton from "~/components/praktyka/loadings"

export default function Loading() {
  return (
    <PageHeaderWrapper isPending={true}>
      <EnhancedExamSkeleton />
    </PageHeaderWrapper>
  )
}
