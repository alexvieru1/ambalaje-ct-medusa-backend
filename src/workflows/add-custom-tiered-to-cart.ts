// src/workflows/add-custom-tiered-to-cart.ts

import { createWorkflow, transform, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { useQueryGraphStep } from "@medusajs/medusa/core-flows"
import { addToCartWorkflow } from "@medusajs/medusa/core-flows"

type AddCustomTieredToCartWorkflowInput = {
  cart_id: string
  item: {
    variant_id: string
    quantity: number
    metadata?: Record<string, unknown>
  }
}

export const addCustomTieredToCartWorkflow = createWorkflow(
  "add-custom-tiered-to-cart",
  ({ cart_id, item }: AddCustomTieredToCartWorkflowInput) => {
    // Retrieve the cart's details (including currency)
    // @ts-ignore
    const { data: carts } = useQueryGraphStep({
      entity: "cart",
      filters: { id: cart_id },
      fields: ["id", "currency_code"],
    })

    // Retrieve the variant's details (including prices)
    // @ts-ignore
    const { data: variants } = useQueryGraphStep({
      entity: "variant",
      fields: [
        "id",
        "prices.*",
      ],
      filters: {
        id: item.variant_id,
      },
      options: {
        throwIfKeyNotFound: true,
      },
    }).config({ name: "retrieve-variant" })

    // Find the correct price tier for the quantity and currency
    const price = transform({ variants, carts, item }, (data) => {
      const currency = data.carts[0].currency_code
      // @ts-ignore
      const prices = data.variants[0].prices.filter((p: any) => p.currency_code === currency)
      // Find the price tier that matches the quantity
      const priceTier = prices.find((p: any) => {
        const min = p.min_quantity ?? 1
        const max = p.max_quantity ?? Infinity
        return data.item.quantity >= min && data.item.quantity <= max
      })
      // Fallback to the first price if no tier matches
      return priceTier ? priceTier.amount : prices[0]?.amount
    })

    // Prepare the item to add with the correct unit_price
    const itemToAdd = transform({ item, price }, (data) => {
      return [{
        ...data.item,
        unit_price: data.price,
      }]
    })

    // Add the item to the cart using the built-in workflow
    addToCartWorkflow.runAsStep({
      input: {
        items: itemToAdd,
        cart_id,
      },
    })
  }
)