import { useMemo } from "react";
import { api } from "~/trpc/react";

export default function useFriendList({ search }: { search: string }) {
  const queryInfo = api.users.getUsersFromSearch.useInfiniteQuery(
    {
      search: search,
      limit: 1,
    },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
      initialCursor: 0,
    },
  );
  const { data, isLoading, isError, error } = queryInfo;
  // Combine all pages into a single flat array for rendering
  const allFriends = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) ?? [];
  }, [data]);

  return { friendList: allFriends, queryInfo };
}
