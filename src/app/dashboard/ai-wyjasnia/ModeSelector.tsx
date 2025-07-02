import { Baby, Cpu, ListCollapse } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ModeSelector({
  selectedMode,
  handleSelectMode,
}: {
  selectedMode: string;
  handleSelectMode: (mode: string) => void;
}) {
  const modes = [
    {
      name: "ELI5",
      description:
        "Simple words, fun examples, easy to understand for everyone",
      icon: <Baby size={40} />,
    },
    {
      name: "Detailed",
      description:
        "Thorough explanations with examples, context, and practical applications",
      icon: <ListCollapse size={40} />,
    },
    {
      name: "Technical",
      description:
        "In-depth analysis with technical details, formulas, and advancedconcepts",
      icon: <Cpu size={40} />,
    },
  ];

  return (
    <div className="space-y-3 flex flex-col ">
      <label className="text-sm font-medium">
        Choose Your Explanation Mode
      </label>
      <div className="flex justify-center gap-4">
        {modes.map((mode) => {
          return (
            <div
              key={mode.name}
              className={`${cn(selectedMode === mode.name && "border-foreground ")} cursor-pointer transition-all duration-200  hover:scale-102 border-2 relative w-1/3 h-48 p-6  rounded-xl `}
              onClick={() => {
                handleSelectMode(mode.name);
              }}
            >
              <div className="  flex flex-col items-center justify-center text-center space-y-3">
                <div
                  className={`w-12 h-12  rounded-full flex items-center justify-center`}
                >
                  <span className="font-bold text-xl">{mode.icon}</span>
                </div>
                <div>
                  <h3 className="font-semibold  text-lg">{mode.name}</h3>
                </div>
                <p className=" text-xs leading-relaxed">{mode.description}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
