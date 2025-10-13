import FullScreenError from "../full-screen-error"
import { Card, CardContent } from "../ui/card"

export default function Achievements() {
  return (
    <Card>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <FullScreenError errorMessage="Nowa funkcjonalność będzie dostępna wkrótce — dziękujemy za cierpliwość." />
        </div>
      </CardContent>
    </Card>
  )
}
