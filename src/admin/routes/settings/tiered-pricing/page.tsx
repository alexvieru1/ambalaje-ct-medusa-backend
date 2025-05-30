// src/admin/routes/settings/tiered-pricing/page.tsx
import { Container, Heading, Button, Input, Select, toast } from "@medusajs/ui";
import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { sdk } from "../../../lib/sdk";
import { defineRouteConfig } from "@medusajs/admin-sdk";

const TieredPricingPage = () => {
  const [productId, setProductId] = useState("");
  const [variantId, setVariantId] = useState("");
  const [variants, setVariants] = useState<any[]>([]);
  const [price1, setPrice1] = useState("");
  const [price2, setPrice2] = useState("");
  const [price3, setPrice3] = useState("");

  useEffect(() => {
    if (!productId) return;

    const fetchVariants = async () => {
      try {
        const res = (await sdk.client.fetch(
          `/admin/products/${productId}`
        )) as {
          product: {
            id: string;
            variants: {
              id: string;
              title: string;
              prices: {
                amount: number;
                currency_code: string;
                min_quantity: number;
                max_quantity?: number;
              }[];
            }[];
          };
        };

        const fetchedVariants = res.product.variants;
        setVariants(fetchedVariants);
        setVariantId(fetchedVariants[0]?.id || "");
      } catch (err) {
        console.error(err);
        toast.error("Invalid product ID or failed to load variants");
        setVariants([]);
        setVariantId("");
      }
    };

    fetchVariants();
  }, [productId]);

  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      sdk.client.fetch("/admin/tiered-pricing", {
        method: "POST",
        body: {
          productId,
          variants: variants.map((v) => {
            if (v.id === variantId) {
              return {
                id: v.id,
                prices: [
                  {
                    amount: parseFloat(price1),
                    currency_code: "ron",
                    min_quantity: 1,
                    max_quantity: 9,
                  },
                  {
                    amount: parseFloat(price2),
                    currency_code: "ron",
                    min_quantity: 10,
                    max_quantity: 24,
                  },
                  {
                    amount: parseFloat(price3),
                    currency_code: "ron",
                    min_quantity: 25,
                  },
                ],
              };
            }

            // Preserve untouched variants' prices
            return {
              id: v.id,
              prices: v.prices.map((p: any) => ({
                amount: p.amount,
                currency_code: p.currency_code,
                min_quantity: p.min_quantity,
                ...(p.max_quantity !== null && p.max_quantity !== undefined
                  ? { max_quantity: p.max_quantity }
                  : {}),
              })),
            };
          }),
        },
      }),
    onSuccess: () => toast.success("Tiered pricing updated"),
    onError: () => toast.error("Failed to update pricing"),
  });

  const handleSubmit = () => {
    if (!productId || !variantId || !price1 || !price2 || !price3) {
      toast.error("Please fill in all fields");
      return;
    }

    mutate();
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">Tiered Pricing</Heading>
      </div>
      <div className="px-6 py-8 space-y-4">
        <Input
          placeholder="Product ID"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
        />

        {variants.length > 0 && (
          <Select value={variantId} onValueChange={setVariantId}>
            <Select.Trigger>
              <Select.Value placeholder="Select a variant..." />
            </Select.Trigger>
            <Select.Content>
              {variants.map((v) => (
                <Select.Item key={v.id} value={v.id}>
                  {v.title}
                </Select.Item>
              ))}
            </Select.Content>
          </Select>
        )}

        <Input
          type="number"
          placeholder="Price for 1-9"
          value={price1}
          onChange={(e) => setPrice1(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price for 10-24"
          value={price2}
          onChange={(e) => setPrice2(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Price for 25+"
          value={price3}
          onChange={(e) => setPrice3(e.target.value)}
        />

        <Button variant="primary" onClick={handleSubmit} isLoading={isPending}>
          Update Tiered Prices
        </Button>
      </div>
    </Container>
  );
};

export const config = defineRouteConfig({
  label: "Tiered Pricing",
});

export default TieredPricingPage;
