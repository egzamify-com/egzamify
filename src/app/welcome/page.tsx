"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { useRouter } from "next/navigation"
import { useState } from "react"
import FullScreenError from "~/components/full-screen-error"
import FullScreenLoading from "~/components/full-screen-loading"
import OnBoardingCompleted from "~/components/onboarding/on-boarding-completed"
import PersonalDetails from "~/components/onboarding/personal-details"
import UserQualifications from "~/components/onboarding/user-qualifications"
import Welcome from "~/components/onboarding/welcome"

export type OnboardingState =
  | "welcome"
  | "user-personal-details"
  | "user-qualifications"
  | "completed"

export default function Page() {
  const [currentStep, setCurrentStep] = useState<OnboardingState>("welcome")
  const {
    data: user,
    isPending,
    error,
  } = useQuery(api.users.query.getCurrentUser)
  const router = useRouter()

  if (isPending) return <FullScreenLoading />

  if (error || !user)
    return (
      <FullScreenError errorMessage="Nie udało się pobrać twoich danych." />
    )

  if (user.onBoarded) {
    router.push("/")
    return <FullScreenLoading />
  }

  function render() {
    if (!user) return null
    switch (currentStep) {
      case "welcome":
        return <Welcome {...{ setCurrentStep }} />
      case "user-personal-details":
        return <PersonalDetails {...{ setCurrentStep, user: user }} />
      case "user-qualifications":
        return <UserQualifications {...{ setCurrentStep, user }} />
      case "completed":
        return <OnBoardingCompleted {...{ user }} />
    }
  }

  return (
    <div className="relative flex flex-1 flex-col items-center justify-center gap-20">
      <div>
        <h1 className="logo-font-onboarding">Witamy w Egzamify!</h1>
      </div>
      {render()}
    </div>
  )
}
