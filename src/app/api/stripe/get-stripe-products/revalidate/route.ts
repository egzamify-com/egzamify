import { revalidatePath, revalidateTag } from "next/cache"
import { type NextRequest, NextResponse } from "next/server"
import { env } from "~/env"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get("secret")

  if (secret !== env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 })
  }

  try {
    // Revalidate the /pricing page
    revalidatePath("/pricing")
    revalidateTag("products")
    console.log(
      "[STRIPE] Revalidated stripe products cache, from special route",
    )
    return NextResponse.json({ revalidated: true, now: Date.now() })
  } catch (err) {
    console.error(err)
    return NextResponse.json({ message: "Error revalidating" }, { status: 500 })
  }
}

// curl "http://localhost:3000/api/stripe/get-stripe-products/revalidate?secret="
