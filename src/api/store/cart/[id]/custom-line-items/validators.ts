// src/api/store/cart/[id]/custom-line-items/validators.ts
import { z } from "zod"
export const PostStoreAddCustomLineItem = z.object({
  variant_id: z.string(),
  quantity: z.number(),
  metadata: z.record(z.unknown()).optional(),
})