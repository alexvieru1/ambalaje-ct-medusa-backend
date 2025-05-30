// src/api/store/cart/[id]/custom-line-items/route.ts
import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { z } from "zod";
import { PostStoreAddCustomLineItem } from "./validators";
import { addCustomTieredToCartWorkflow } from "../../../../../workflows/add-custom-tiered-to-cart";

type PostStoreAddCustomLineItemType = z.infer<
  typeof PostStoreAddCustomLineItem
>;

export const POST = async (
  req: MedusaRequest<PostStoreAddCustomLineItemType>,
  res: MedusaResponse
) => {
  const { id } = req.params;
  const item = req.validatedBody;

  await addCustomTieredToCartWorkflow(req.scope).run({
    input: {
      cart_id: id,
      item,
    },
  });

  res.status(200).json({ success: true });
};
