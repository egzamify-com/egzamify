"use client";

import { Card, CardContent, CardFooter } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Calendar, HelpCircle } from "lucide-react";
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
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    });
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
        <Card key={qualification.id} className="flex flex-col overflow-hidden">
          <div className="relative h-40 bg-gray-200">
            <img
              src={"/placeholder.svg"}
              alt={qualification.name}
              className="h-full w-full object-cover"
            />
            {/* <Badge
              className="absolute top-2 right-2"
              variant={
                qualification.level === "Beginner"
                  ? "outline"
                  : qualification.level === "Intermediate"
                    ? "secondary"
                    : qualification.level === "Advanced"
                      ? "default"
                      : "destructive"
              }
            >
              {qualification.level}
            </Badge> */}
          </div>
          <CardContent className="flex-grow pt-4">
            <h3 className="text-lg font-semibold">{qualification.name}</h3>
            <p className="mt-1 text-sm text-gray-500">
              {/* {qualification.description} */}
            </p>

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
          {/* <CardFooter className="flex flex-wrap gap-2 pt-0 pb-4">
            <Badge variant="outline">{qualification.category}</Badge>
            {qualification.skills.slice(0, 2).map((skill) => (
              <Badge key={skill} variant="secondary">
                {skill}
              </Badge>
            ))}
            {qualification.skills.length > 2 && (
              <Badge variant="secondary">
                +{qualification.skills.length - 2}
              </Badge>
            )}
          </CardFooter> */}
        </Card>
      ))}
    </div>
  );
}
