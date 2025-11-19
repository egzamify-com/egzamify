"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { Swords, Trophy, Users, Zap } from "lucide-react"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import {
  OnlineModeCard,
  type OnlineModeCardProps,
} from "./(components)/quiz-game-card"

export default function Page() {
  const user = useQuery(api.users.query.getCurrentUser)
  if (!user.data) return
  return (
    <PageHeaderWrapper
      title="Tryby online"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div className="grid w-full grid-cols-1 gap-4 xl:grid-cols-2">
        <OnlineModeCard
          {...{
            ...pvpQuizCardProps(),
          }}
        />
      </div>
    </PageHeaderWrapper>
  )
}

export function pvpQuizCardProps(): OnlineModeCardProps {
  return {
    mainIcon: <Swords />,
    primaryActionText: "Rozpocznij",
    href: "/dashboard/online/pvp-quiz",
    title: "Quiz Duel",
    description: `Ty i twoj rywal dostajecie dokładnie ten sam quiz – liczą się tylko punkty i refleks. 
          Kto zdobędzie wyższy wynik, ten wygrywa. Ale jeśli oboje wykręcicie ten sam wynik, to wygrywa szybszy.`,
    badges: [
      { badgeText: "Pojedynek 1v1", badgeIcon: <Trophy /> },
      { badgeText: "Czas", badgeIcon: <Zap /> },
    ],
    bigBgText: "VS",
  }
}
