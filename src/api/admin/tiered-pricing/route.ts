import type { MedusaRequest, MedusaResponse } from "@medusajs/framework"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { productId, variants } = req.body as {
    productId: string
    variants: {
      id: string
      prices: {
        amount: number
        currency_code: string
        min_quantity: number
        max_quantity?: number
      }[]
    }[]
  }

  if (!productId || !variants?.length) {
    return res.status(400).json({ message: "Missing required fields" })
  }

  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      products: [
        {
          id: productId,
          variants,
        },
      ],
    },
  })

  res.send(result)
}
