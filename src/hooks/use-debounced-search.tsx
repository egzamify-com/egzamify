import { useEffect, useState, type ChangeEvent } from "react";
import { useDebounce } from "./useDebounce";

export default function useDebouncedSearch({ time }: { time: number }) {
  const [search, setSearch] = useState("");
  const [isSearchPending, setIsSearchPending] = useState(false);
  const debouncedSearch = useDebounce(search, time);

  useEffect(() => {
    if (search !== debouncedSearch) {
      setIsSearchPending(true);
    } else {
      setIsSearchPending(false);
    }
  }, [search, debouncedSearch]);

  return {
    isPending: isSearchPending && search.length > 0,
    debouncedSearch,
    inputOnChange: (e: ChangeEvent<HTMLInputElement>) => {
      setSearch(e.target.value);
    },
    search,
  };
}
