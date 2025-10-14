import FriendsSkeleton from "~/components/friends/friend-list-skeleton"
import PageHeaderWrapper from "~/components/page-header-wrapper"

export default function Loading() {
  return (
    <PageHeaderWrapper isPending={true}>
      <FriendsSkeleton countOfSkeletons={10} />
    </PageHeaderWrapper>
  )
}
