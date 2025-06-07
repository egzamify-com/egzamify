import { Card, CardContent } from "../ui/card";

export default function AiResponses({
  aiResponses,
}: {
  aiResponses: string[];
}) {
  return (
    <>
      {aiResponses.map((aiResponse) => {
        return (
          <Card key={aiResponse} className="bg-slate-50">
            <CardContent className="">
              <div className="flex items-center justify-center">
                <span className="ml-3 text-slate-600">{aiResponse}</span>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </>
  );
}
