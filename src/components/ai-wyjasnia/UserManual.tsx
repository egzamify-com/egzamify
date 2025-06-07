import { ChevronDown, ChevronUp, Sparkles } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "~/components/ui/collapsible";

export default function UserManual() {
  const [isManualOpen, setIsManualOpen] = useState(false);
  return (
    <Collapsible open={isManualOpen} onOpenChange={setIsManualOpen}>
      <CollapsibleTrigger asChild>
        <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-dashed border-slate-300 hover:border-slate-400">
          <CardHeader className="text-center py-8">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <CardTitle className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Explainer
              </CardTitle>
              <Sparkles className="h-8 w-8 text-purple-600" />
            </div>
            <p className="text-slate-600 text-lg">
              Your intelligent companion for understanding complex topics
            </p>
            <div className="flex items-center justify-center mt-4">
              {isManualOpen ? (
                <ChevronUp className="h-5 w-5 text-slate-500" />
              ) : (
                <ChevronDown className="h-5 w-5 text-slate-500" />
              )}
              <span className="ml-2 text-sm text-slate-500">
                {isManualOpen ? "Hide Guide" : "Show Guide"}
              </span>
            </div>
          </CardHeader>
        </Card>
      </CollapsibleTrigger>

      <CollapsibleContent>
        <Card className="mt-4">
          <CardContent className="pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-lg mb-3 text-slate-800">
                  How to Use
                </h3>
                <ul className="space-y-2 text-slate-600">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">1.</span>
                    Enter your topic or question in the prompt field
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">2.</span>
                    Select an explanation mode that fits your needs
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">3.</span>
                    Click Submit to get your AI-powered explanation
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">4.</span>
                    Use Reroll for alternative explanations
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold">5.</span>
                    Ask follow-up questions for deeper understanding
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-3 text-slate-800">
                  Explanation Modes
                </h3>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg border border-green-200">
                    <h4 className="font-medium text-green-800">Simple</h4>
                    <p className="text-sm text-green-700">
                      Easy-to-understand explanations for beginners
                    </p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <h4 className="font-medium text-blue-800">Detailed</h4>
                    <p className="text-sm text-blue-700">
                      Comprehensive explanations with examples
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg border border-purple-200">
                    <h4 className="font-medium text-purple-800">Technical</h4>
                    <p className="text-sm text-purple-700">
                      In-depth technical analysis for experts
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </CollapsibleContent>
    </Collapsible>
  );
}
