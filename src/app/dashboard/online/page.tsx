import { Trophy, Users, Zap } from "lucide-react"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { PvpQuizCard } from "./(components)/quiz-game-card"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Tryby online"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div className="grid w-full grid-cols-2 gap-4">
        <PvpQuizCard
          href="/dashboard/online/pvp-quiz"
          title="Quiz Duel"
          description="Ty i twoj rywal dostajecie dokładnie ten sam quiz – liczą się tylko punkty i refleks. 
          Kto zdobędzie wyższy wynik, ten wygrywa. Ale jeśli oboje wykręcicie ten sam wynik, to wygrywa szybszy."
          firstBadgeIcon={<Trophy />}
          firstBadgeText="Pojedynek 1v1"
          secondBadgeIcon={<Zap />}
          secondBadgeText="Czas"
          bigBgText="VS"
        />
      </div>
    </PageHeaderWrapper>
  )
}
