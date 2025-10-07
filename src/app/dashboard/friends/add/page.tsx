"use client"

import { UserPlus } from "lucide-react"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Dodaj znajomych"
      description="Wyszukaj i dodaj znajomych..."
      icon={<UserPlus size={pageHeaderWrapperIconSize} />}
    >
      <DisplayFriendList
        filter="not_friends"
        notFoundComponent={
          <div className="flex flex-col items-start gap-2">
            <p className="mt-2 text-gray-500">Brak użytkowników.</p>
          </div>
        }
      />
    </PageHeaderWrapper>
  )
}
