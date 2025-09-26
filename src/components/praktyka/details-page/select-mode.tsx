import { Check, CircleDot } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { PracticalExamCheckMode } from "~/actions/request-practical-exam-check-action";
import { APP_CONFIG } from "~/APP_CONFIG";
import { Card } from "~/components/ui/card";
import { Label } from "~/components/ui/label";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";

export default function SelectMode({
  selectedMode,
  setSelectedMode,
}: {
  selectedMode: PracticalExamCheckMode;
  setSelectedMode: Dispatch<SetStateAction<PracticalExamCheckMode>>;
}) {
  return (
    <>
      <div className="mx-auto max-w-4xl">
        <div className="mb-4">
          <h1 className="mb-2 flex flex-row items-center justify-start gap-1 font-semibold">
            <CircleDot className="mr-2 h-5 w-5" /> Choose Your Mode
          </h1>
          <p className="text-muted-foreground text-sm">
            Select the exam rating option that best fits your needs
          </p>
        </div>

        <RadioGroup
          defaultValue="standard"
          onValueChange={(value: PracticalExamCheckMode) =>
            setSelectedMode(value)
          }
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <ModeCard
            selectedMode={selectedMode}
            mode="standard"
            title="Standard Review"
            description="Get essential feedback on your practical exam with key
            insights and improvement suggestions"
            smallDescription="Perfect for quick feedback"
          />

          <ModeCard
            selectedMode={selectedMode}
            mode="complete"
            title="Complete Breakdown"
            description="Comprehensive analysis, scoring
          breakdown, and personalized recommendations"
            smallDescription="Most comprehensive option"
          />
        </RadioGroup>
      </div>
    </>
  );
}
function ModeCard({
  selectedMode,
  mode,
  title,
  description,
  smallDescription,
}: {
  selectedMode: PracticalExamCheckMode;
  mode: PracticalExamCheckMode;
  title: string;
  description: string;
  smallDescription: string;
}) {
  return (
    <div className="relative h-full">
      <RadioGroupItem value={mode} id={mode} className="sr-only" />
      <Label htmlFor={mode} className="cursor-pointer">
        <Card
          className={`border-2 p-6 transition-all duration-200 hover:shadow-lg ${
            mode === selectedMode
              ? "border-primary bg-primary/5 shadow-md"
              : "border-border hover:border-primary/50"
          }`}
        >
          <div className="mb-4 flex items-start justify-between">
            <div className="flex-1">
              <div className="flex flex-row items-start justify-between">
                <h3 className="text-foreground mb-2 text-lg font-semibold">
                  {title}
                </h3>
                {mode === selectedMode && (
                  <div className="ml-4 flex-shrink-0">
                    <div className="bg-primary flex h-6 w-6 items-center justify-center rounded-full">
                      <Check className="text-primary-foreground h-4 w-4" />
                    </div>
                  </div>
                )}
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed font-normal">
                {description}
              </p>
            </div>
          </div>

          <div className="mt-auto flex flex-row items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-foreground text-3xl font-bold">
                  {mode === "complete"
                    ? APP_CONFIG.practicalExamRating.completePrice
                    : APP_CONFIG.practicalExamRating.standardPrice}
                </span>
                <span className="text-muted-foreground font-medium">
                  credits
                </span>
              </div>

              <p className="text-muted-foreground mt-1 text-sm font-normal">
                {smallDescription}
              </p>
            </div>
          </div>
        </Card>
      </Label>
    </div>
  );
}
