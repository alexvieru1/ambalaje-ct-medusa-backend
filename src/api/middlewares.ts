import {
  defineMiddlewares,
  validateAndTransformBody,
} from "@medusajs/framework/http";
import { SearchSchema } from "./store/products/search/route";
import { PostStoreAddCustomLineItem } from "./store/cart/[id]/custom-line-items/validators";

export default defineMiddlewares({
  routes: [
    {
      matcher: "/store/products/search",
      method: ["POST"],
      middlewares: [validateAndTransformBody(SearchSchema)],
    },
    {
      matcher: "/store/cart/:id/custom-line-items",
      method: "POST",
      middlewares: [validateAndTransformBody(PostStoreAddCustomLineItem)],
    },
  ],
});
