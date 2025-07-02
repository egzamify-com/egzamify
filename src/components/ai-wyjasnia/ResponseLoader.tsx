import { Card, CardContent } from "../ui/card";

export default function ResponseLoader() {
  return (
    <Card className="border-foreground">
      <CardContent className="pt-6">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 ">Generating explanation...</span>
        </div>
      </CardContent>
    </Card>
  );
}
