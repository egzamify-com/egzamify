import { convexAuthNextjsToken } from "@convex-dev/auth/nextjs/server"
import { api } from "convex/_generated/api"
import { fetchQuery } from "convex/nextjs"
import { Settings } from "lucide-react"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import OrderHistorySection from "~/components/settings/order-history/order-history-section"
import ProfileSection from "~/components/settings/profile-section/profile-section"

export default async function SettingsPage() {
  const user = await fetchQuery(
    api.users.query.getCurrentUser,
    {},
    { token: await convexAuthNextjsToken() },
  )

  return (
    <PageHeaderWrapper
      title="Ustawienia"
      description="Zarządzaj konfiguracją swojego konta."
      icon={<Settings size={pageHeaderWrapperIconSize} />}
    >
      <div className="flex w-full flex-col items-center justify-start">
        <div className="flex w-3xl flex-col items-center justify-start gap-6">
          <ProfileSection {...{ user }} />
          <OrderHistorySection {...{ user }} />
        </div>
      </div>
    </PageHeaderWrapper>
  )
}
