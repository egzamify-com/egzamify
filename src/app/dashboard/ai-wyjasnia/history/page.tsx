"use client";

import { api as ConvexApi } from "convex/_generated/api";
import { useQuery } from "convex/react";
// type HistoryOutput = inferProcedureOutput<
//   AppRouter["aiWyjasnia"]["getAiResponsesHistory"]
// >;

export default function HistoryPage() {
  const isLoading = false;
  const history = useQuery(ConvexApi.ai_wyjasnia.queries.getAiResponsesHistory);
  console.log("history from convex ", history);

  if (!history) {
    return <div>no hisotyr</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br  p-4">
      {history.map((item) => {
        return <div key={item._id}>{item._id}</div>;
      })}
    </div>
  );
}
