import type { Message } from "ai";
import { Badge } from "../ui/badge";

export default function MessageMode({ message }: { message: Message }) {
  return (
    <div className="absolute top-[-35px] left-[5px]">
      {message.role === "assistant" &&
        parseAnnotations(message.annotations) && (
          <Badge variant="outline">
            {parseAnnotations(message.annotations)}
          </Badge>
        )}
    </div>
  );
}
function parseAnnotations(annotations: any) {
  if (!annotations) return null;
  // console.log("annotations", annotations[0].mode);
  return annotations[0].mode;
}
