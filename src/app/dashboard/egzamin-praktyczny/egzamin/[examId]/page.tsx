import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server";
import { api } from "convex/_generated/api";
import type { Id } from "convex/_generated/dataModel";
import { fetchQuery } from "convex/nextjs";
import {
  ArrowLeft,
  Award,
  BookOpen,
  Calendar,
  Clock,
  Download,
  FileText,
  User,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import FullScreenError from "~/components/full-screen-error";
import { ExamDetailSkeleton } from "~/components/praktyka/loadings";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { tryCatch } from "~/utils/tryCatch";

type PropsType = Promise<{ examId: string }>;

export default async function Page({ params }: { params: PropsType }) {
  return (
    <>
      <Suspense fallback={<ExamDetailSkeleton />}>
        <Component params={params} />
      </Suspense>
    </>
  );
}
async function Component({ params }: { params: PropsType }) {
  const { examId } = await params;
  const [exam, error] = await tryCatch(
    fetchQuery(
      api.praktyka.query.getExamDetails,
      {
        examId: examId as Id<"basePracticalExams">,
      },
      { token: await convexAuthNextjsToken() },
    ),
  );
  if (error) {
    console.log("[ERROR]", error);
    return (
      <FullScreenError
        errorMessage="Failed to load exam"
        errorDetail={error.message}
      />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
        <Link
          href="/dashboard/egzamin-praktyczny"
          className="mb-6 inline-flex items-center hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Exams
        </Link>
        <div className="grid gap-8 lg:grid-cols-4">
          {/* Main Content */}
          <div className="space-y-6 lg:col-span-3">
            {/* Header */}
            <div className="rounded-lg border p-6">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1">
                  <div className="mb-2 flex items-center gap-3">
                    <Badge variant="outline">lbale</Badge>
                    <Badge
                      className="bg-orange-100 text-orange-800"
                      variant="outline"
                    >
                      trundy
                    </Badge>
                  </div>
                  <h1 className="mb-2 text-3xl font-bold">tytul</h1>
                  <p className="mb-4 text-lg">opis</p>
                  <p className="">opis</p>
                </div>
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-2 gap-4 border-t pt-4 text-sm md:grid-cols-4">
                <div className="flex items-center">
                  <Calendar className="mr-2 h-4 w-4" />
                  <span>33/33/3333</span>
                </div>
                <div className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />

                  <span>5 hours</span>
                </div>
                <div className="flex items-center">
                  <Users className="mr-2 h-4 w-4" />
                  <span>10 enrolled</span>
                </div>
                <div className="flex items-center">
                  <Award className="mr-2 h-4 w-4" />
                  <span>10% to pass</span>
                </div>
              </div>
            </div>

            {/* Instructions - Main Content */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center text-xl">
                  <FileText className="mr-2 h-5 w-5" />
                  Exam Instructions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-gray max-w-none">TEST TEST</div>
              </CardContent>
            </Card>

            {/* Attachments */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Download className="mr-2 h-5 w-5" />
                  Reference Materials & Attachments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="flex items-center rounded-lg border p-4 transition-colors">
                    <div className="flex-1">
                      <h4 className="font-medium">Name</h4>
                      <p className="mt-1 text-sm">opis</p>
                      <Badge variant="outline" className="mt-2 text-xs">
                        type
                      </Badge>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Action Buttons */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button size="lg" className="w-full">
                    <User className="mr-2 h-4 w-4" />
                    test button label
                  </Button>
                </CardContent>
              </Card>

              {/* Topics */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <BookOpen className="mr-2 h-5 w-5" />
                    Topics Covered
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">topic</ul>
                </CardContent>
              </Card>

              {/* Requirements */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">TEST TEST TEST RETQ</ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
