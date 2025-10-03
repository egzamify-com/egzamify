"use client"

import { Search } from "lucide-react"
import Link from "next/link"
import DisplayFriendList from "~/components/friends/display-friend-list"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { Button } from "~/components/ui/button"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Moi znajomi"
      description="Zarządzaj swoimi kontaktami i pozostań w kontakcie"
    >
      <DisplayFriendList
        filter="accepted_friends"
        notFoundComponent={
          <div className="flex flex-col items-start gap-2">
            <p className="mt-2">Nie masz jeszcze żadnych znajomych.</p>
            <Link href={`/dashboard/friends/add`}>
              <Button>
                <Search /> Znajdź nowych znajomych
              </Button>
            </Link>
          </div>
        }
      />
    </PageHeaderWrapper>
  )
}
