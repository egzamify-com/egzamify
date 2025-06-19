"use client";

import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Suspense, useEffect, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { useDebounce } from "~/hooks/useDebounce";
import { api } from "~/trpc/react";
import Friend from "../friend";

export default function Page() {
  const [search, setSearch] = useState("");
  const [isSearchPending, setIsSearchPending] = useState(false);
  const debouncedSearch = useDebounce(search, 1000);

  const { reset } = useQueryErrorResetBoundary();

  useEffect(() => {
    if (search !== debouncedSearch) {
      setIsSearchPending(true);
    } else {
      setIsSearchPending(false);
    }
  }, [search, debouncedSearch]);

  return (
    <>
      <Input
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
      />
      {isSearchPending && search.length > 0 && <LoadingComponent />}
      {!isSearchPending && (
        <ErrorBoundary
          onError={(error) => {
            console.log(error);
          }}
          onReset={reset}
          fallbackRender={({ resetErrorBoundary }) => (
            <div>
              There was an error!
              <Button onClick={() => resetErrorBoundary()}>Try again</Button>
            </div>
          )}
        >
          <Suspense fallback={<LoadingComponent />}>
            <FindFriends search={debouncedSearch} />
          </Suspense>
        </ErrorBoundary>
      )}
    </>
  );
}
function FindFriends({ search }: { search: string }) {
  const {
    "1": { data },
  } = api.users.getUsersFromSearch.useSuspenseQuery({
    search,
  });

  return (
    <div>
      {search &&
        data.map((potentialFriend) => (
          <Friend
            key={`potentialFriend-${potentialFriend.id}`}
            friend={{ user: potentialFriend }}
          />
        ))}
    </div>
  );
}
function LoadingComponent() {
  return <div>ITS LOADING NOW ...</div>;
}
