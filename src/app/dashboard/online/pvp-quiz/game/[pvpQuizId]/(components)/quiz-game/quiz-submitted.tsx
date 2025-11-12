import SpinnerLoading from "~/components/spinner-loading"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card"

export default function QuizSubmitted() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center">
      <Card className="w-1/2">
        <CardHeader>
          <CardTitle>
            <h1>Przeslano quiz!</h1>
          </CardTitle>
          <CardDescription>
            <p>Oczekiwanie na przeciwnika.</p>
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center">
          <SpinnerLoading />
        </CardContent>
      </Card>
    </div>
  )
}
