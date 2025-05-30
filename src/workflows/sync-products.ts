import {
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { useQueryGraphStep } from "@medusajs/medusa/core-flows";
import { syncProductsStep, SyncProductsStepInput } from "./steps/sync-products";

type SyncProductsWorkflowInput = {
  filters?: Record<string, unknown>;
  limit?: number;
  offset?: number;
};

export const syncProductsWorkflow = createWorkflow(
  "sync-products",
  ({ filters, limit, offset }: SyncProductsWorkflowInput) => {
    // @ts-ignore
    const { data, metadata } = useQueryGraphStep({
      entity: "product",
      fields: [
        "id",
        "title",
        "description",
        "handle",
        "thumbnail",
        "categories.*",
        "tags.*",
        "variants.id",
        "variants.title",
        "variants.sku",           // Include SKU
        "variants.prices.*", // Include all prices for each variant
      ],
      pagination: {
        take: limit,
        skip: offset,
      },
      filters: {
        // @ts-ignore
        status: "published",
        ...filters,
      },
    });

    syncProductsStep({
      products: data,
    } as SyncProductsStepInput);

    return new WorkflowResponse({
      products: data,
      metadata,
    });
  }
);
