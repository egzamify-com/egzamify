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
      {aiResponses.map((aiResponse) => {
        const randomId = crypto.randomUUID();
        return (
          <div key={randomId} className="flex flex-col gap-6">
            {aiResponse.followUpQuestion && (
              <UserPrompt userPrompt={aiResponse.followUpQuestion} />
            )}
            <Card className="bg-slate-50">
              <CardContent className="">
                <div className="flex items-start justify-start  flex-col  gap-2">
                  <div className="ml-3">
                    <Badge>
                      <p>{aiResponse.mode}</p>
                    </Badge>
                  </div>
                  <span className="ml-3 text-slate-600">
                    {aiResponse.aiResponse}
                  </span>
                </div>
              </CardContent>
            </Card>
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
          <span className="ml-3 text-slate-600">{userPrompt}</span>
        </div>
      </CardContent>
    </Card>
  );
}
