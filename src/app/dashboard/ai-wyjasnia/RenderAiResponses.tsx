import { Badge } from "~/components/ui/badge";
import type { AiResponseWithFollowUpQuesion } from "~/server/db/schema/ai-wyjasnia";
import { Card, CardContent } from "../../../components/ui/card";
export default function RenderAiResponses({
  aiResponses,
}: {
  aiResponses: AiResponseWithFollowUpQuesion[];
}) {
  // console.log(aiResponses);
  return (
    <>
      {aiResponses.map((aiResponse, idx) => {
        const randomId = crypto.randomUUID();
        return (
          <div key={randomId} className="flex flex-col gap-6">
            <div className="space-y-3">
              <div key={idx}>
                {aiResponse.userPrompt && (
                  <div
                    className={`border-muted-foreground rounded-md border overflow-hidden shadow-sm transition-all duration-300 `}
                  >
                    <div className="p-3  border-b ">
                      <p className="text-sm font-medium text-muted-foreground ">
                        {aiResponse.userPrompt}
                      </p>
                    </div>
                    <div className="p-3 text-sm ">{aiResponse.aiResponse}</div>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
}
export function UserPrompt({ userPrompt }: { userPrompt: string }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-start  flex-col  gap-2">
          <div className="ml-3">
            <Badge>
              <p>You</p>
            </Badge>
          </div>
          <span className="ml-3 ">{userPrompt}</span>
        </div>
      </CardContent>
    </Card>
  );
}
