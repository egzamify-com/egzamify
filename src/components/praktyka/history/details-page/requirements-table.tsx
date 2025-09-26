"use client";

import type { Doc } from "convex/_generated/dataModel";
import { CheckCircle2, ChevronDown, ChevronRight, XCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";

export default function RequirementsTable({
  aiRating,
}: {
  aiRating: Doc<"usersPracticalExams">["aiRating"];
}) {
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(
    new Set(),
  );
  const [expandedRequirements, setExpandedRequirements] = useState<Set<string>>(
    new Set(),
  );

  if (!aiRating) return null;
  if (!aiRating.details) return null;

  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  const toggleRequirement = (requirementId: string) => {
    const newExpanded = new Set(expandedRequirements);
    if (newExpanded.has(requirementId)) {
      newExpanded.delete(requirementId);
    } else {
      newExpanded.add(requirementId);
    }
    setExpandedRequirements(newExpanded);
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold">Objective Breakdown</h3>
      <div className="space-y-3">
        {aiRating.details.map((category) => {
          const categoryId = `${category.symbol}-${category.title}`;
          const isExpanded = expandedCategories.has(categoryId);

          return (
            <Card key={categoryId} className="overflow-hidden py-0">
              <CardContent className="p-0">
                {/* Category Header */}
                <Button
                  variant="ghost"
                  className="hover:bg-muted/50 h-auto w-full justify-between p-4 text-left"
                  onClick={() => toggleCategory(categoryId)}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold">{category.symbol}</span>
                    <span className="text-lg font-semibold">
                      {category.title}
                    </span>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="h-4 w-4 shrink-0" />
                  ) : (
                    <ChevronRight className="h-4 w-4 shrink-0" />
                  )}
                </Button>

                {/* Requirements List */}
                {isExpanded && (
                  <div className="border-t">
                    {category.requirements.map((requirement) => {
                      const requirementId = `${categoryId}-${requirement.symbol}`;
                      const hasExplanation =
                        requirement.answer?.explanation &&
                        requirement.answer.explanation !== "N/A";
                      const isRequirementExpanded =
                        expandedRequirements.has(requirementId);

                      return (
                        <div
                          key={requirementId}
                          className="border-b last:border-b-0"
                        >
                          {/* Requirement Main Info */}
                          <div className="flex items-start gap-3 p-4">
                            {/* Status Icon */}
                            <div className="flex flex-row items-center gap-2">
                              <div className="flex shrink-0 items-center justify-center">
                                {requirement.answer?.isCorrect ? (
                                  <CheckCircle2
                                    className="text-green-500"
                                    size={20}
                                  />
                                ) : (
                                  <XCircle className="text-red-500" size={20} />
                                )}
                              </div>

                              {/* Symbol */}
                              <div className="bg-muted shrink-0 rounded px-2 py-1 text-sm font-medium">
                                {requirement.symbol}
                              </div>
                            </div>

                            {/* Description */}
                            <div className="min-w-0 flex-1">
                              <p className="text-sm leading-relaxed">
                                {requirement.description}
                              </p>
                            </div>

                            {/* Expand Button for Explanation */}
                            {hasExplanation && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 w-8 shrink-0 p-0"
                                onClick={() => toggleRequirement(requirementId)}
                              >
                                {isRequirementExpanded ? (
                                  <ChevronDown className="h-3 w-3" />
                                ) : (
                                  <ChevronRight className="h-3 w-3" />
                                )}
                              </Button>
                            )}
                          </div>

                          {/* Explanation (Collapsible) */}
                          {hasExplanation && isRequirementExpanded && (
                            <div className="px-4 pt-0 pb-4">
                              <div className="bg-muted/30 ml-8 rounded-md p-3">
                                <p className="text-muted-foreground text-sm leading-relaxed">
                                  {requirement.answer?.explanation}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
