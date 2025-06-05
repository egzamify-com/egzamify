"use client";

import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  BookOpen,
  Shuffle,
  Database,
  Clock,
  Target,
  Search,
} from "lucide-react";

interface GameModesProps {
  qualificationName?: string;
}

export default function GameModes({
  qualificationName = "Kwalifikacja",
}: GameModesProps) {
  const gameModes = [
    {
      id: 1,
      title: "40 pytań z teorii",
      description:
        "Pełny test teoretyczny składający się z 40 pytań. Symulacja prawdziwego egzaminu.",
      icon: BookOpen,
      difficulty: "Trudny",
      duration: "60 min",
      questions: 40,
      color: "bg-blue-500",
      variant: "default" as const,
    },
    {
      id: 2,
      title: "1 losowe pytanie",
      description:
        "Szybki test z jednym losowym pytaniem. Idealny do codziennej nauki.",
      icon: Shuffle,
      difficulty: "Łatwy",
      duration: "2 min",
      questions: 1,
      color: "bg-green-500",
      variant: "secondary" as const,
    },
    {
      id: 3,
      title: "Przeglądanie bazy pytań",
      description:
        "Przeglądaj wszystkie dostępne pytania i odpowiedzi bez ograniczeń czasowych.",
      icon: Database,
      difficulty: "Dowolny",
      duration: "Bez limitu",
      questions: "Wszystkie",
      color: "bg-purple-500",
      variant: "outline" as const,
    },
  ];

  const handleModeSelect = (modeId: number) => {
    const qualificationId = qualificationName?.split(" ")[1] || "1"; // Extract ID from qualification name

    switch (modeId) {
      case 1:
        // 40 pytań z teorii
        window.location.href = `/dashboard/teoria/${qualificationId}/game-modes/full-test`;
        break;
      case 2:
        // 1 losowe pytanie
        window.location.href = `/dashboard/teoria/${qualificationId}/game-modes/random-question`;
        break;
      case 3:
        // Przeglądanie bazy pytań
        window.location.href = `/dashboard/teoria/${qualificationId}/game-modes/browse-questions`;
        break;
      default:
        console.log(`Nieznany tryb: ${modeId}`);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="mb-2 text-3xl font-bold">Wybierz tryb gry</h1>
        <p className="text-gray-600">
          Kwalifikacja:{" "}
          <span className="font-semibold">{qualificationName}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {gameModes.map((mode) => {
          const IconComponent = mode.icon;

          return (
            <Card
              key={mode.id}
              className="group relative cursor-pointer overflow-hidden transition-shadow duration-300 hover:shadow-lg"
              onClick={() => handleModeSelect(mode.id)}
            >
              <div
                className={`absolute top-0 right-0 left-0 h-1 ${mode.color}`}
              />

              <CardHeader className="pb-4">
                <div className="mb-2 flex items-center justify-between">
                  <div className={`rounded-lg p-3 ${mode.color} bg-opacity-10`}>
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <Badge variant={mode.variant}>{mode.difficulty}</Badge>
                </div>
                <CardTitle className="text-xl transition-colors group-hover:text-blue-600">
                  {mode.title}
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm leading-relaxed text-gray-600">
                  {mode.description}
                </p>

                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>{mode.duration}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Target className="h-4 w-4" />
                    <span>{mode.questions} pytań</span>
                  </div>
                </div>

                <Button
                  className="mt-4 w-full transition-colors group-hover:bg-blue-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleModeSelect(mode.id);
                  }}
                >
                  {mode.id === 3 ? (
                    <>
                      <Search className="mr-2 h-4 w-4" />
                      Przeglądaj
                    </>
                  ) : (
                    "Rozpocznij"
                  )}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 text-center">
        <Button variant="outline" onClick={() => window.history.back()}>
          Powrót do kwalifikacji
        </Button>
      </div>
    </div>
  );
}
