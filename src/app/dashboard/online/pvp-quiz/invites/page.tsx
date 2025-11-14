"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { APP_CONFIG } from "~/APP_CONFIG"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import PageHeaderWrapper from "~/components/page-header-wrapper"
import { parseConvexError } from "~/lib/utils"
import InviteItemCard from "./(components)/invite-card"

export default function Page() {
  const { data, isPending, error } = useQuery(
    api.pvp_quiz.query.getOnlineInvites,
  )

  if (isPending) {
    return <FullScreenLoading />
  }

  if (error) {
    return (
      <FullScreenError
        errorMessage={APP_CONFIG.defaultFullScreenErrorMessage}
        errorDetail={parseConvexError(error)}
      />
    )
  }

  if (data.length === 0) {
    return <FullScreenError type="warning" errorMessage="Brak zaproszeń." />
  }

  return (
    <PageHeaderWrapper title="Zaproszenia">
      <div className="flex w-full flex-col items-center justify-start gap-4">
        {data.map((quizInvite) => {
          return (
            <InviteItemCard
              key={crypto.randomUUID()}
              {...{
                userId: quizInvite.creatorUserId,
                quizInvite: quizInvite,
              }}
            />
          )
        })}
      </div>
    </PageHeaderWrapper>
  )
}
