import { usePaginatedQuery } from "convex-helpers/react/cache"
import { api } from "convex/_generated/api"
import type { friendFilterValidator } from "convex/friends/helpers"
import type { Infer } from "convex/values"
import { Search } from "lucide-react"
import { type ReactNode } from "react"
import { APP_CONFIG } from "~/APP_CONFIG"
import useDebouncedSearch from "~/hooks/use-debounced-search"
import { cn } from "~/lib/utils"
import LoadMoreBtn from "../load-more"
import { Input } from "../ui/input"
import Friend, { type FriendProps } from "./friend"
import FriendsSkeleton from "./friend-list-skeleton"

export default function DisplayFriendList({
  filter,
  notFoundComponent,
  friendItemProps,
  fullWidthSearchBar,
}: {
  filter: Infer<typeof friendFilterValidator>
  notFoundComponent?: ReactNode
  friendItemProps?: FriendProps

  fullWidthSearchBar?: boolean
}) {
  const { isPending, debouncedSearch, inputOnChange, search } =
    useDebouncedSearch({ time: 250 })
  return (
    <div className={cn(`container mx-auto`)}>
      <div className="relative mb-6">
        <Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform" />
        <Input
          value={search}
          onChange={inputOnChange}
          placeholder="Wyszukaj znajomego..."
          className={cn("pl-10", fullWidthSearchBar ? "w-full" : "w-1/2")}
        />
      </div>
      {isPending && <FriendsSkeleton countOfSkeletons={5} />}
      {!isPending && (
        <Render
          search={debouncedSearch}
          filter={filter}
          notFoundComponent={notFoundComponent}
          friendItemProps={friendItemProps}
        />
      )}
    </div>
  )
}

function Render({
  search,
  filter,
  notFoundComponent,
  friendItemProps,
}: {
  search: string
  filter: Infer<typeof friendFilterValidator>
  notFoundComponent?: ReactNode
  friendItemProps?: FriendProps
}) {
  let query = api.friends.query.getPaginatedFriends
  switch (filter) {
    case "not_friends":
      query = api.friends.query.getPaginatedNotFriends
      break
    case "accepted_friends":
      query = api.friends.query.getPaginatedFriends
      break
    case "outcoming_requests":
      query = api.friends.query.getPaginatedOutgoingRequests
      break
    case "incoming_requests":
      query = api.friends.query.getPaginatedIncomingRequests
      break
  }

  const {
    results: friendList,
    status,
    loadMore,
  } = usePaginatedQuery(
    query,
    {
      search,
    },
    { initialNumItems: APP_CONFIG.friends.friendsPerPage },
  )

  if (status === "LoadingFirstPage") {
    return <FriendsSkeleton countOfSkeletons={5} />
  }

  if (
    (friendList.length === 0 && search) ||
    (friendList.length === 0 && !notFoundComponent)
  ) {
    return <p className="text-muted-foreground text-base">{"Brak wyników."}</p>
  }

  if (friendList.length === 0 && notFoundComponent) {
    return <>{notFoundComponent}</>
  }

  return (
    <div className="space-y-3">
      {friendList.map((friend) => (
        <div key={`friend-${friend?._id}`}>
          {friend && (
            <Friend
              friend={{
                ...friendItemProps,
                user: friend,
              }}
            />
          )}
        </div>
      ))}
      {status === "LoadingMore" && <FriendsSkeleton countOfSkeletons={5} />}
      <LoadMoreBtn
        onClick={() => loadMore(APP_CONFIG.friends.friendsPerPage)}
        canLoadMore={status === "CanLoadMore"}
      />
    </div>
  )
}
