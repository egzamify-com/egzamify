"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
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

  if (error || !data) {
    return (
      <FullScreenError
        errorMessage={"Cos poszlo nie tak"}
        errorDetail={parseConvexError(error)}
      />
    )
  }

  return (
    <PageHeaderWrapper title="Zaproszenia">
      <div>
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
