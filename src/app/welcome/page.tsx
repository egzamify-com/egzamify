"use client"

import { api } from "convex/_generated/api"
import { useQuery } from "convex/custom_helpers"
import { useState } from "react"
import FullScreenError from "~/components/full-screen-error"
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
    isPending: isPendingUser,
    error: userError,
  } = useQuery(api.users.query.getCurrentUser)

  if (userError)
    return (
      <FullScreenError errorMessage="Nie udało się pobrać twoich danych." />
    )

  function render() {
    switch (currentStep) {
      case "welcome":
        return <Welcome {...{ setCurrentStep }} />
      case "user-personal-details":
        return <PersonalDetails {...{ setCurrentStep }} />
      case "user-qualifications":
        return <UserQualifications {...{ setCurrentStep }} />
      case "completed":
        return <OnBoardingCompleted {...{ setCurrentStep }} />
    }
  }

  return (
    <div className="flex flex-1 flex-col items-center justify-center border border-red-500">
      <h1 className="text-5xl font-bold">Witamy w Egzamify!</h1>
      {render()}
    </div>
  )
}
