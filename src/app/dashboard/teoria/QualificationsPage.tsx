"use client";

import type { inferProcedureOutput } from "@trpc/server";
import { useMemo, useState } from "react";
import FilterOptions from "~/components/filter-options";
import SearchBar from "~/components/search-bar";
import SortOptions from "~/components/sort-options";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import QualificationsGrid from "~/components/updated-qualifications-grid";
import type { AppRouter } from "~/server/api/root";
// import { qualifications } from "~/data/qualifications"

export type qualificationsOutput = inferProcedureOutput<
  AppRouter["qualifications"]["getQualificationsList"]
>;

export default function QualificationsPage({
  initialQualifications,
}: {
  initialQualifications: qualificationsOutput;
}) {
  const [qualifications, setQualifications] = useState<qualificationsOutput>(
    initialQualifications,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("title");

  const filteredAndSortedQualifications = useMemo(() => {
    const filtered = qualifications.qualifications.filter((qualification) => {
      // Search filter
      const matchesSearch = qualification.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      return matchesSearch;
    }, []);

    // Sort the filtered results
    // filtered.sort((a, b) => {
    //   switch (sortBy) {
    //     case "title":
    //       return a.name.localeCompare(b.name);
    //     case "questionsCount":
    //       return b.questionsCount - a.questionsCount; // Descending order
    //     case "releaseDate":
    //       return (
    //         new Date(b.releaseDate).getTime() -
    //         new Date(a.releaseDate).getTime()
    //       ); // Most recent first
    //     case "category":
    //       return a.category.localeCompare(b.category);
    //     default:
    //       return 0;
    //   }
    // });

    return filtered;
  }, [searchQuery, selectedCategories, selectedLevels, sortBy]);

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">AI Learning Qualifications</h1>

      <div className="mb-6 flex flex-col gap-4 lg:flex-row">
        <div className="flex-1">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
        </div>
        <div className="flex flex-col gap-2 sm:flex-row">
          <SortOptions sortBy={sortBy} setSortBy={setSortBy} />
          <FilterOptions
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedLevels={selectedLevels}
            setSelectedLevels={setSelectedLevels}
          />
        </div>
      </div>

      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredAndSortedQualifications.length} of{" "}
        {qualifications.qualifications.length} qualifications
      </div>

      <Tabs defaultValue="list" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="list">List View</TabsTrigger>
          <TabsTrigger value="grid">Grid View</TabsTrigger>
          <TabsTrigger value="icon-grid">Icon Grid</TabsTrigger>
        </TabsList>
        <TabsContent value="list">
          {/* <QualificationsList
            qualifications={filteredAndSortedQualifications}
          /> */}
        </TabsContent>
        <TabsContent value="grid">
          <QualificationsGrid
            qualifications={filteredAndSortedQualifications}
          />
        </TabsContent>
      </Tabs>
    </main>
  );
}
