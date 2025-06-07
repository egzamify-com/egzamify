import { Loader } from "lucide-react";
import { cn } from "~/lib/utils";

export default function ModeSelector({
  selectedMode,
  handleSelectMode,
  disabled,
}: {
  selectedMode: string;
  handleSelectMode: (mode: string) => void;
  disabled?: boolean;
}) {
  const modes = [
    {
      name: "ELI5",
      value: "eli5",
      description:
        "Simple words, fun examples, easy to understand for everyone",
      icon: <Loader />,
    },
    {
      name: "Detailed",
      value: "detailed",
      description:
        "Thorough explanations with examples, context, and practical applications",
      icon: <Loader />,
    },
    {
      name: "Technical",
      value: "technical",
      description:
        "In-depth analysis with technical details, formulas, and advancedconcepts",
      icon: <Loader />,
    },
  ];

  return (
    <div className="space-y-3 flex flex-col ">
      <label className="text-sm font-medium text-slate-700">
        Choose Your Explanation Mode
      </label>
      <div className="flex justify-center gap-4">
        {modes.map((mode) => {
          return (
            <div
              key={mode.value}
              className={`${cn(disabled ? "opacity-50 cursor-not-allowed" : " cursor-pointer transition-all duration-200  hover:scale-102", "border-2 relative w-1/3 h-48 p-6  rounded-xl")} `}
              onClick={() => {
                if (disabled) return;
                handleSelectMode(mode.value);
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
                {selectedMode === mode.value && (
                  <div className="absolute top-2 right-2 w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
