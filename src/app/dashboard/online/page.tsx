import { Users } from "lucide-react"
import Link from "next/link"
import PageHeaderWrapper, {
  pageHeaderWrapperIconSize,
} from "~/components/page-header-wrapper"
import { Button } from "~/components/ui/button"

export default function Page() {
  return (
    <PageHeaderWrapper
      title="Tryby online"
      icon={<Users size={pageHeaderWrapperIconSize} />}
    >
      <div>
        <Link href={"/dashboard/online/pvp-quiz"}>
          <Button>Pvp quiz battle</Button>
        </Link>
      </div>
    </PageHeaderWrapper>
  )
}
