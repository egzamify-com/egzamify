"use client";

import { Card, CardContent } from "~/components/ui/card";
import { Calendar, HelpCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import type { qualificationsOutput } from "~/app/dashboard/teoria/QualificationsPage";

interface Qualification {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  skills: string[];
  image: string;
  questionsCount: number;
  releaseDate: string;
}

interface QualificationsGridProps {
  qualifications: Qualification[];
}

export default function QualificationsGrid({
  qualifications,
}: qualificationsOutput) {
  const router = useRouter();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
  };

  const handleCardClick = (qualification: any) => {
    router.push(`/dashboard/teoria/${qualification.id}/game-modes`);
  };

  if (qualifications.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-lg text-gray-500">
          No qualifications found matching your criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {qualifications.map((qualification) => (
        <Card
          key={qualification.id}
          className="flex cursor-pointer flex-col overflow-hidden transition-shadow duration-300 hover:shadow-lg"
          onClick={() => handleCardClick(qualification)}
        >
          <div className="relative h-40 bg-gray-200">
            <img
              src={"/placeholder.svg"}
              alt={qualification.name}
              className="h-full w-full object-cover"
            />
          </div>
          <CardContent className="flex-grow pt-4">
            <h3 className="text-lg font-semibold transition-colors hover:text-blue-600">
              {qualification.name}
            </h3>
            <p className="mt-1 text-sm text-gray-500"></p>

            <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <HelpCircle className="h-4 w-4" />
                <span>10 questions</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>
                  {qualification.created_at?.getDate() ?? "nie ma daty"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
