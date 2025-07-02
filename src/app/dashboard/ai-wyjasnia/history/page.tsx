"use client";

import type { inferProcedureOutput } from "@trpc/server";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Clock,
  MessageCircle,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import SpinnerLoading from "~/components/SpinnerLoading";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import type { AppRouter } from "~/server/api/root";
import { api } from "~/trpc/react";

type HistoryOutput = inferProcedureOutput<
  AppRouter["aiWyjasnia"]["getAiResponsesHistory"]
>;

export default function HistoryPage() {
  const { data, isLoading } = api.aiWyjasnia.getAiResponsesHistory.useQuery();
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {},
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [history, setHistory] = useState<HistoryOutput>([]);

  useEffect(() => {
    if (!data) return;

    setHistory(data);

    console.log(data);
  }, [data]);

  const toggleExpand = (id: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const filteredHistory = history.filter(
    (item) =>
      item.aiResponsesWithQuestions[0]?.userPrompt
        .toLowerCase()
        .includes(searchQuery.toLowerCase()) ??
      item.aiResponsesWithQuestions?.some((q) =>
        q.aiResponse.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
  );

  const formatRelativeTime = (date: Date) => {
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getModeColor = (mode?: string) => {
    switch (mode) {
      case "eli5":
        return "bg-green-100 text-green-800 border-green-200";
      case "detailed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "technical":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getModeLabel = (mode?: string) => {
    switch (mode) {
      case "eli5":
        return "ELI5";
      case "detailed":
        return "Detailed";
      case "technical":
        return "Technical";
      default:
        return mode;
    }
  };

  if (!filteredHistory) {
    return <div>no history</div>;
  }
  return (
    <div className="min-h-screen bg-gradient-to-br  p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link href="/dashboard/ai-wyjasnia">
            <Button
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Explainer
            </Button>
          </Link>
          <h1 className="text-2xl font-bold ">Explanation History</h1>
          <div className="w-[100px]"></div> {/* Spacer for centering */}
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Your Learning Journey
              </CardTitle>
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 " />
                <Input
                  placeholder="Search history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 w-[200px]"
                />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="flex justify-center flex-col gap-4 items-center py-12">
                <SpinnerLoading />
                <p>Loading history</p>
              </div>
            )}
            {filteredHistory.length === 0 && !isLoading ? (
              <div className="text-center py-12">
                <p className="0">No history items found</p>
                {searchQuery && (
                  <p className="text-sm text-slate-400 mt-2">
                    Try adjusting your search query
                  </p>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredHistory.map((item) => (
                  <Card key={item.id} className="overflow-hidden  pb-0">
                    <div
                      className=" cursor-pointer 0 transition-colors flex items-center justify-between"
                      onClick={() => toggleExpand(item.id)}
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-1 h-12 rounded-full transition-all duration-300 ${
                              expandedItems[item.id] ? "h-16" : "h-12"
                            } ${
                              item.aiResponsesWithQuestions[0]?.mode === "eli5"
                                ? "bg-green-500"
                                : item.aiResponsesWithQuestions[0]?.mode ===
                                    "detailed"
                                  ? "bg-blue-500"
                                  : "bg-purple-500"
                            }`}
                          ></div>
                          <div>
                            <h3 className="font-medium 0">
                              {item.aiResponsesWithQuestions[0]?.userPrompt}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                              <span
                                className={`inline-flex items-center px-2 rounded-full text-xs font-medium border transition-all duration-200 ${
                                  expandedItems[item.id]
                                    ? "scale-105"
                                    : "scale-100"
                                } ${getModeColor(item.aiResponsesWithQuestions[0]?.mode)}`}
                              >
                                {getModeLabel(
                                  item.aiResponsesWithQuestions[0]?.mode,
                                )}
                              </span>
                              <span className="text-xs text-muted-foreground">
                                {formatRelativeTime(item.created_at)}
                              </span>
                              {item.aiResponsesWithQuestions?.length > 0 && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MessageCircle className="h-3 w-3" />
                                  {item.aiResponsesWithQuestions.length}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="transition-transform duration-200 mr-4">
                        {expandedItems[item.id] ? (
                          <ChevronUp className="h-5 w-5 transform rotate-0" />
                        ) : (
                          <ChevronDown className="h-5 w-5  transform rotate-0" />
                        )}
                      </div>
                    </div>

                    <div
                      className={`transition-all duration-300 ease-in-out overflow-hidden ${
                        expandedItems[item.id]
                          ? "max-h-[1000px] opacity-100"
                          : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="border-t ">
                        <div className="p-4  transform transition-transform duration-300">
                          <div
                            className={`transition-all duration-300 delay-100 ${
                              expandedItems[item.id]
                                ? "translate-y-0 opacity-100"
                                : "translate-y-4 opacity-0"
                            }`}
                          >
                            {item.aiResponsesWithQuestions?.length > 0 && (
                              <div>
                                <h4 className="text-sm font-medium  mb-2">
                                  Follow-up Questions
                                </h4>
                                <div className="space-y-3">
                                  {item.aiResponsesWithQuestions.map(
                                    (q, idx) => (
                                      <div key={idx}>
                                        {q.userPrompt && (
                                          <div
                                            className={` rounded-md border border-muted-foreground  overflow-hidden shadow-sm transition-all duration-300 ${
                                              expandedItems[item.id]
                                                ? "translate-x-0 opacity-100"
                                                : "translate-x-4 opacity-0"
                                            }`}
                                            style={{
                                              transitionDelay: expandedItems[
                                                item.id
                                              ]
                                                ? `${200 + idx * 100}ms`
                                                : "0ms",
                                            }}
                                          >
                                            <div className="p-3 border-b text-muted-foreground ">
                                              <p className="text-sm font-medium ">
                                                {q.userPrompt}
                                              </p>
                                            </div>
                                            <div className="p-3 text-sm ">
                                              {q.aiResponse}
                                            </div>
                                          </div>
                                        )}
                                      </div>
                                    ),
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
