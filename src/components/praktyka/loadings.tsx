"use client";

import { BookOpen, Calendar, Search } from "lucide-react";
import { Card } from "../ui/card";
import { Skeleton } from "../ui/skeleton";

export default function EnhancedExamSkeleton() {
  return (
    <div className="min-h-screen">
      {/* Header Skeleton */}
      <div className="border-b">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex-1">
              {/* Title Skeleton */}
              <Skeleton className="mb-2 h-9 w-80" />
              {/* Subtitle Skeleton */}
              <Skeleton className="h-5 w-96" />
            </div>

            <div className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>
      </div>

      {/* Filters Skeleton */}
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        <div className="mb-8 rounded-lg border">
          <div className="flex flex-col gap-4 lg:flex-row">
            {/* Search Skeleton */}
            <div className="relative flex-1">
              <Search className="absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 transform" />
              <Skeleton className="h-10 w-full" />
            </div>

            {/* Filter Dropdowns Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="w-full lg:w-48">
                <Skeleton className="h-10 w-full" />
              </div>
            ))}

            {/* Filter Button Skeleton */}
            <div className="w-full lg:w-auto">
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </div>

        {/* Exam Groups Skeleton */}
        <div className="space-y-6">
          {[1, 2, 3, 4, 5].map((index) => (
            <ExamGroupSkeleton key={index} />
          ))}
        </div>

        {/* Load More Button Skeleton */}
        <div className="mt-12 text-center">
          <Skeleton className="mx-auto h-12 w-40" />
        </div>
      </div>
    </div>
  );
}

export function ExamGroupSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg border shadow-sm">
      {/* Group Header Skeleton */}
      <div className="border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            {/* Qualification Title Skeleton */}
            <Skeleton className="mb-2 h-6 w-64" />

            {/* Date and Count Info Skeleton */}
            <div className="flex items-center">
              <Calendar className="mr-2 h-4 w-4" />
              <Skeleton className="mr-2 h-4 w-24" />
              <div className="mx-2 h-1 w-1 rounded-full"></div>
              {/* Separator */}
              <Skeleton className="h-4 w-32" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Badge Skeleton */}
            <Skeleton className="h-6 w-20 rounded-full" />

            {/* Chevron and Text Skeleton */}
            <div className="flex items-center">
              <Skeleton className="mr-2 h-3 w-16" />
              <Skeleton className="h-5 w-5 rounded" />
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
export function LoadingMore({ isLoading }: { isLoading: boolean }) {
  return (
    <>
      {isLoading && (
        <div className="space-y-6">
          {[1, 2, 3].map((index) => (
            <ExamGroupSkeleton key={index} />
          ))}
        </div>
      )}
    </>
  );
}
