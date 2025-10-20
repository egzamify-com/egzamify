import EnhancedExamSkeleton from "~/components/egzamin-praktyczny/loadings"
import PageHeaderWrapper from "~/components/page-header-wrapper"

export default function Loading() {
  return (
    <PageHeaderWrapper isPending={true}>
      <EnhancedExamSkeleton />
    </PageHeaderWrapper>
  )
}
