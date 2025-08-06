"use client";

import { BookOpen, Calendar, Search } from "lucide-react";
import { Card, CardAction, CardDescription } from "../ui/card";
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

import { ArrowLeft, Download, FileText } from "lucide-react";
import { CardContent, CardHeader, CardTitle } from "~/components/ui/card";

export function ExamDetailSkeleton() {
  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Button Skeleton */}
        <div className="mb-6 inline-flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" />
          <Skeleton className="h-4 w-24" />
        </div>

        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content Skeleton */}
          <div className="space-y-6 lg:col-span-3">
            <ExamHeaderSkeleton />

            <ExamInstructionsSkeleton />

            <ExamAttachmentsSkeleton />
          </div>

          {/* Sidebar Skeleton */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Action Buttons Card Skeleton */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">
                    <Skeleton className="h-6 w-24" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Skeleton className="h-12 w-full" /> {/* Button */}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export function ExamAttachmentsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Download className="mr-2 h-5 w-5 text-gray-300" />
          <Skeleton className="h-6 w-64" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          {[1, 2].map(
            (
              i, // Show 2 attachment skeletons
            ) => (
              <div key={i} className="flex items-center rounded-lg border p-4">
                <Skeleton className="mr-4 h-16 w-16 flex-shrink-0 rounded" />{" "}
                {/* Image */}
                <div className="flex-1">
                  <Skeleton className="mb-1 h-5 w-48" /> {/* Name */}
                  <Skeleton className="mb-2 h-4 w-full" /> {/* Description */}
                  <Skeleton className="h-5 w-16 rounded-full" /> {/* Badge */}
                </div>
                <Skeleton className="h-9 w-28 rounded-md" />{" "}
                {/* Download Button */}
              </div>
            ),
          )}
        </div>
      </CardContent>
    </Card>
  );
}
export function ExamHeaderSkeleton() {
  return (
    <Card className="rounded-lg border p-6">
      <div className="mb-4 flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-2 flex items-center gap-3">
            <Skeleton className="h-6 w-16 rounded-full" /> {/* Badge 1 */}
            <Skeleton className="h-6 w-20 rounded-full" /> {/* Badge 2 */}
          </div>
          <Skeleton className="mb-2 h-9 w-3/4" /> {/* Title */}
          <Skeleton className="mb-4 h-6 w-2/3" /> {/* Qualification */}
          <Skeleton className="h-5 w-full" /> {/* Description line 1 */}
        </div>
        {/* Small Image Skeleton */}
        <Skeleton className="ml-6 h-20 w-32 flex-shrink-0 rounded-lg" />
      </div>

      {/* Metadata Skeleton */}
      <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm md:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="flex items-center">
            <Calendar className="mr-2 h-4 w-4 text-gray-300" />{" "}
            {/* Icon placeholder */}
            <Skeleton className="h-4 w-24" /> {/* Text placeholder */}
          </div>
        ))}
      </div>
    </Card>
  );
}
export function ExamInstructionsSkeleton() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center text-xl">
          <FileText className="mr-2 h-5 w-5 text-gray-300" />
          <Skeleton className="h-6 w-48" />
        </CardTitle>
      </CardHeader>
    </Card>
  );
}
export function SelectSourceSkeleton() {
  return (
    <Card id="select-sources" className="gap-0">
      <CardHeader>
        <CardTitle>
          <Skeleton className="h-8 w-48" /> {/* Skeleton for the title */}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <CardDescription>
          <Skeleton className="h-4 w-64" /> {/* Skeleton for description */}
        </CardDescription>
        <div className="flex w-full flex-col gap-4">
          {/* Skeletons for individual AttachmentItem components */}
          {[1, 2, 3].map(
            (
              i, // Render a few skeleton items
            ) => (
              <div
                key={i}
                className="flex items-center rounded-lg border p-4 transition-colors"
              >
                <div className="flex-1">
                  <Skeleton className="h-6 w-3/4" />{" "}
                  {/* Skeleton for attachment name */}
                </div>
                <div className="flex flex-row items-center justify-center gap-2">
                  <Skeleton className="h-10 w-10 rounded-md" />{" "}
                  {/* Skeleton for image icon button */}
                  <Skeleton className="h-10 w-28 rounded-md" />{" "}
                  {/* Skeleton for download button */}
                  <Skeleton className="h-10 w-24 rounded-md" />{" "}
                  {/* Skeleton for delete button */}
                </div>
              </div>
            ),
          )}
        </div>
        <CardAction className="flex w-full flex-row items-end justify-end">
          <Skeleton className="h-10 w-40 rounded-md" />{" "}
          {/* Skeleton for UploadAttachment button */}
        </CardAction>
      </CardContent>
    </Card>
  );
}
export function MainContentLoading({ title }: { title?: string }) {
  return (
    <>
      <ExamHeaderSkeleton />
      <Card className="mx-auto w-full max-w-4xl space-y-6 p-6">
        {title && (
          <h2 className="text-primary animate-pulse text-center text-3xl font-bold">
            {title}
          </h2>
        )}
        <Skeleton className="mx-auto h-8 w-3/4" />
        <Skeleton className="mx-auto h-4 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-full" />
          </div>
          <div className="flex flex-col items-center justify-center space-y-2 rounded-lg p-4 shadow-sm">
            <Skeleton className="h-12 w-24" />
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-10 w-full max-w-[200px]" />
          </div>
        </div>
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-96 w-full" />
      </Card>
      <ExamInstructionsSkeleton />
      <ExamAttachmentsSkeleton />
    </>
  );
}
export function UserExamItemSkeleton() {
  return (
    <Card className="overflow-hidden rounded-lg shadow-sm">
      <CardContent className="flex items-center justify-between">
        <div>
          <Skeleton className="mb-2 h-6 w-64" />
        </div>

        <div className="flex items-center">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </CardContent>
    </Card>
  );
}
