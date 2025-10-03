import { Badge } from "../ui/badge";
import { Card, CardContent, CardHeader } from "../ui/card";

export default function Achievements() {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-xl font-semibold">Achievements</h2>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="px-3 py-1">
            🏆 Top Contributor
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            ⭐ 5 Year Member
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🔥 Streak Master
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            💎 Premium User
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🎯 Goal Achiever
          </Badge>
          <Badge variant="secondary" className="px-3 py-1">
            🚀 Early Adopter
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
