// src/api/workflow/route.ts

import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows";

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  // Replace these with your actual product and variant IDs
  const productId = "prod_01JTRHY8G45BDNA6T05PT5QK68"; // e.g., "prod_123"
  const variant1Id = "variant_01JTRHY8HYYGFZBV5RCPFAMSQ7"; // e.g., "variant_1"
  const variant2Id = "variant_01JTRHY8HZE41E5MMXHC3WG5VA"; // e.g., "variant_2"

  const { result } = await updateProductsWorkflow(req.scope).run({
    input: {
      products: [
        {
          id: productId,
          variants: [
            {
              id: variant1Id,
              prices: [
                {
                  amount: 19.99,
                  currency_code: "ron",
                  min_quantity: 1,
                  max_quantity: 9,
                },
                {
                  amount: 18.49,
                  currency_code: "ron",
                  min_quantity: 10,
                  max_quantity: 24,
                },
                { amount: 16.99, currency_code: "ron", min_quantity: 25 },
              ],
            },
            {
              id: variant2Id,
              prices: [
                {
                  amount: 29.99,
                  currency_code: "ron",
                  min_quantity: 1,
                  max_quantity: 9,
                },
                {
                  amount: 28.49,
                  currency_code: "ron",
                  min_quantity: 10,
                  max_quantity: 24,
                },
                { amount: 26.99, currency_code: "ron", min_quantity: 25 },
              ],
            },
          ],
        },
      ],
    },
  });

  res.send(result);
}
