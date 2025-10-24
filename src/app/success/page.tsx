import { Gem } from "lucide-react"
import FullScreenError from "~/components/full-screen-error"
import DashboardBtn from "~/components/landing-page/dashboard-btn"
import HandleToasts from "~/components/payments/handle-toasts"
import { tryCatch } from "~/lib/tryCatch"
import { polarApi } from "~/server/polar"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ checkoutId: string | undefined }>
}) {
  const checkoutId = (await searchParams).checkoutId
  if (!checkoutId) return <div>Checkout ID not found</div>
  console.log({ checkoutId })
  const [checkout, error] = await tryCatch(
    (async () => {
      return await polarApi.checkouts.get({ id: checkoutId })
    })(),
  )
  if (error)
    return (
      <FullScreenError
        errorMessage="Nie znaleziono sesji"
        errorDetail={error.message}
      />
    )

  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4">
      <HandleToasts
        status={checkout.status}
        productName={checkout.product.name}
      />
      <h1 className="text-5xl font-bold">{`Dziękujemy za zakup!`}</h1>
      <h1 className="flex flex-row gap-2 text-3xl font-bold">
        {`Zakupiono`}
        <div className="flex flex-row items-center justify-center gap-2">
          <Gem />
          {`${checkout.product.name}!`}
        </div>
      </h1>
      <DashboardBtn />
    </div>
  )
}
