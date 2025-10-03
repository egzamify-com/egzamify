import { Card, CardContent, CardHeader } from "../ui/card";

export default function UserCharts() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Activity Chart</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex h-48 items-center justify-center rounded-lg">
            <p className="text-muted-foreground">Activity Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <h3 className="text-lg font-semibold">Progress Stats</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex h-48 items-center justify-center rounded-lg">
            <p className="text-muted-foreground">Progress Chart Placeholder</p>
          </div>
        </CardContent>
      </Card>

      <Card className="md:col-span-2">
        <CardHeader>
          <h3 className="text-lg font-semibold">Performance Overview</h3>
        </CardHeader>
        <CardContent>
          <div className="bg-muted flex h-64 items-center justify-center rounded-lg">
            <p className="text-muted-foreground">
              Performance Chart Placeholder
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
