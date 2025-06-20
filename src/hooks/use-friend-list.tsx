import { useMemo } from "react";
import type { FriendsFilter } from "~/server/api/routers/users";
import { api } from "~/trpc/react";

export default function useFriendList({
  search,
  filter,
}: {
  search: string;
  filter: FriendsFilter;
}) {
  const queryInfo = api.users.getUsersFromSearch.useInfiniteQuery(
    {
      search: search,
      limit: 1,
      filter: filter,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    },
  );
  const { data } = queryInfo;
  // Combine all pages into a single flat array for rendering
  const allFriends = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return { friendList: allFriends, queryInfo };
}
