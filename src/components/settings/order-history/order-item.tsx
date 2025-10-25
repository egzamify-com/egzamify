"use client"

import type { Order } from "@polar-sh/sdk/models/components/order.js"
import { Gem } from "lucide-react"
import { getProductPriceInPln } from "~/components/payments/product-card"
import SemanticDate from "~/components/semantic-date"
import { Badge } from "~/components/ui/badge"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "~/components/ui/item"
import { convertDateToEpoch } from "~/lib/dateUtils"

export default function OrderItem({ order }: { order: Order }) {
  console.log(order.totalAmount)
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle className="flex flex-row items-center justify-center gap-2">
          <Gem size={14} />
          {order.product?.name}
        </ItemTitle>
        <ItemDescription>
          <SemanticDate date={convertDateToEpoch(order.createdAt)} />
        </ItemDescription>
      </ItemContent>
      <ItemActions>
        <Badge variant="outline">
          {getProductPriceInPln(order.netAmount)} PLN
        </Badge>
      </ItemActions>
    </Item>
  )
}
