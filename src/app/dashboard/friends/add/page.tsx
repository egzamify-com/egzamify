"use client"

import { UserPlus } from "lucide-react"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper from "~/components/page-header-wrapper"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Dodaj znajomych"
      description="Wyszukaj i dodaj znajomych..."
      icon={<UserPlus />}
    >
      <DisplayFriendList filter="not_friends" />
    </PageHeaderWrapper>
  )
}
