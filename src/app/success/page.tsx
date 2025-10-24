// import { Suspense } from "react"
// import FullScreenLoading from "~/components/full-screen-loading"

// export default async function SuccessPage() {
//   return (
//     <>
//       <Suspense
//         fallback={
//           <FullScreenLoading
//             loadingMessage="Dziękujemy, otrzymaliśmy twoją płatność!"
//             loadingDetail="Finalizujemy transakcję"
//           />
//         }
//       >
//         <div>success page</div>
//       </Suspense>
//     </>
//   )
// }
export default function Page({
  searchParams: { checkoutId },
}: {
  searchParams: {
    checkoutId: string
  }
}) {
  // Checkout has been confirmed
  // Now, make sure to capture the Checkout.updated webhook event to update the order status in your system

  return (
    <div>
      <h1>Thank you! Your checkout is now being processed.</h1>
    </div>
  )
}
