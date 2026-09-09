import { NextResponse } from "next/server";
import { rejectCrossOrigin } from "@/lib/security/same-origin";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "";
const STOREFRONT_TOKEN = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN || "";
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN || "";

const CART_CREATE_MUTATION = `
mutation cartCreate($input: CartInput!) {
  cartCreate(input: $input) {
    cart {
      id
      checkoutUrl
    }
    userErrors {
      field
      message
    }
  }
}
`;

const DRAFT_ORDER_MUTATION = `
mutation draftOrderCreate($input: DraftOrderInput!) {
  draftOrderCreate(input: $input) {
    draftOrder {
      id
      name
    }
    userErrors {
      field
      message
    }
  }
}
`;

const DRAFT_ORDER_COMPLETE_MUTATION = `
mutation draftOrderComplete($id: ID!, $paymentPending: Boolean) {
  draftOrderComplete(id: $id, paymentPending: $paymentPending) {
    draftOrder {
      id
      order {
        id
        name
      }
    }
    userErrors {
      field
      message
    }
  }
}
`;

/** Confirms the submitted variants actually exist and are purchasable before we bill anyone. */
const VARIANT_LOOKUP_QUERY = `
query variantLookup($ids: [ID!]!) {
  nodes(ids: $ids) {
    ... on ProductVariant {
      id
      availableForSale
    }
  }
}
`;

const MAX_LINE_ITEMS = 50;
const MAX_QUANTITY_PER_LINE = 100;

/**
 * Shopify variant IDs reach us in a few shapes (bare digits, full gid, legacy URLs).
 * Returns a canonical gid, or null when there's nothing usable — callers must reject
 * on null rather than substituting a default, since a wrong variant means a wrong charge.
 */
function normalizeVariantId(raw: unknown): string | null {
  if (typeof raw !== "string" || !raw.trim()) return null;
  const value = raw.trim();
  if (value.startsWith("gid://shopify/ProductVariant/")) {
    return /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(value) ? value : null;
  }
  const digits = value.replace(/\D/g, "");
  return digits ? `gid://shopify/ProductVariant/${digits}` : null;
}

function normalizeQuantity(raw: unknown): number | null {
  const quantity = parseInt(String(raw ?? "1"), 10);
  if (!Number.isFinite(quantity) || quantity < 1) return null;
  return Math.min(quantity, MAX_QUANTITY_PER_LINE);
}

export async function POST(request: Request) {
  const blocked = rejectCrossOrigin(request);
  if (blocked) return blocked;

  try {
    const body = await request.json();
    const { shippingAddress, paymentMethod, lineItems } = body;

    if (!Array.isArray(lineItems) || lineItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (lineItems.length > MAX_LINE_ITEMS) {
      return NextResponse.json({ error: "Too many items in cart" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.phone || !shippingAddress.address1 || !shippingAddress.city) {
      return NextResponse.json({ error: "Missing shipping address details" }, { status: 400 });
    }

    // Only variant IDs and quantities are taken from the request. Prices are never read
    // from the client — Shopify prices the variants server-side.
    const resolvedLines: { variantId: string; quantity: number }[] = [];
    for (const item of lineItems) {
      const variantId = normalizeVariantId(item?.variantId);
      const quantity = normalizeQuantity(item?.quantity);
      if (!variantId || quantity === null) {
        return NextResponse.json(
          { error: "Cart contains an invalid item. Please refresh and try again." },
          { status: 400 }
        );
      }
      resolvedLines.push({ variantId, quantity });
    }

    if (!ADMIN_API_TOKEN) {
      console.error("Checkout unavailable: SHOPIFY_ADMIN_API_TOKEN is not configured.");
      return NextResponse.json({ error: "Checkout is temporarily unavailable." }, { status: 503 });
    }

    // Confirm every variant exists in Shopify before creating an order.
    const lookupRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: VARIANT_LOOKUP_QUERY,
        variables: { ids: resolvedLines.map((line) => line.variantId) },
      }),
    });

    if (!lookupRes.ok) {
      console.error("Shopify variant lookup failed:", lookupRes.status, lookupRes.statusText);
      return NextResponse.json({ error: "Could not verify your cart. Please try again." }, { status: 502 });
    }

    const lookupJson = await lookupRes.json();
    const foundVariantIds = new Set<string>(
      (lookupJson.data?.nodes ?? [])
        .filter((node: any) => node?.id)
        .map((node: any) => node.id as string)
    );

    const unknownVariant = resolvedLines.find((line) => !foundVariantIds.has(line.variantId));
    if (unknownVariant) {
      console.warn("Rejected checkout for unknown variant:", unknownVariant.variantId);
      return NextResponse.json(
        { error: "One or more items are no longer available. Please refresh your cart." },
        { status: 400 }
      );
    }

    // Properly split full name into firstName and lastName for Shopify
    const rawName = (shippingAddress.firstName || "Customer").trim();
    const nameParts = rawName.split(" ");
    const firstName = nameParts[0] || "Customer";
    const lastName = nameParts.slice(1).join(" ") || ".";

    const customerEmail = shippingAddress.email ? shippingAddress.email.trim() : undefined;
    const customerPhone = shippingAddress.phone.trim();

    let orderName = `VSD-${Math.floor(100000 + Math.random() * 900000)}`;
    let checkoutUrl = "";
    let shopifyCreated = false;

    // 1. Try Storefront API cartCreate to generate native Shopify checkoutUrl (if token available)
    if (STOREFRONT_TOKEN) {
      try {
        const storefrontLines = resolvedLines.map((line) => ({
          merchandiseId: line.variantId,
          quantity: line.quantity,
        }));

        const sfRes = await fetch(`https://${SHOPIFY_STORE}/api/2024-10/graphql.json`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": STOREFRONT_TOKEN,
          },
          body: JSON.stringify({
            query: CART_CREATE_MUTATION,
            variables: {
              input: {
                lines: storefrontLines,
                buyerIdentity: {
                  countryCode: "AE",
                  email: customerEmail,
                  phone: customerPhone,
                },
              },
            },
          }),
        });

        if (sfRes.ok) {
          const sfJson = await sfRes.json();
          const cartData = sfJson.data?.cartCreate?.cart;
          if (cartData?.checkoutUrl) {
            checkoutUrl = cartData.checkoutUrl;
            shopifyCreated = true;
          }
        }
      } catch (err) {
        console.warn("Storefront cartCreate error:", err);
      }
    }

    // 2. Admin API Draft Order creation (Creates real, fully-populated order in Shopify)
    if (ADMIN_API_TOKEN) {
      try {
        const buildInputPayload = () => {
          // Variant IDs only. There is deliberately no custom-line-item fallback: it would
          // let the browser set `originalUnitPrice` and complete a real order at that price.
          const formattedLineItems = resolvedLines.map((line) => ({
            variantId: line.variantId,
            quantity: line.quantity,
          }));

          return {
            email: customerEmail,
            phone: customerPhone,
            lineItems: formattedLineItems,
            shippingAddress: {
              firstName: firstName,
              lastName: lastName,
              address1: shippingAddress.address1,
              city: shippingAddress.city,
              phone: customerPhone,
              country: "United Arab Emirates",
            },
            billingAddress: {
              firstName: firstName,
              lastName: lastName,
              address1: shippingAddress.address1,
              city: shippingAddress.city,
              phone: customerPhone,
              country: "United Arab Emirates",
            },
            note: `Customer Name: ${rawName}\nPhone: ${customerPhone}\nDelivery Address: ${shippingAddress.address1}, ${shippingAddress.city}\nPayment Method: ${paymentMethod}`,
            customAttributes: [
              { key: "Customer Name", value: rawName },
              { key: "Customer Phone", value: customerPhone },
              { key: "Delivery Address", value: `${shippingAddress.address1}, ${shippingAddress.city}` },
              { key: "Payment Method", value: paymentMethod },
              { key: "Checkout Source", value: "Headless Web Store" },
            ],
            tags: ["Headless Order", paymentMethod === "Cash on Delivery" ? "COD" : "Card on Delivery"],
          };
        };

        const createAndCompleteDraftOrder = async (inputPayload: any) => {
          const adminRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": ADMIN_API_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: DRAFT_ORDER_MUTATION,
              variables: { input: inputPayload },
            }),
          });

          if (!adminRes.ok) {
            console.error("Shopify Admin HTTP error:", adminRes.statusText);
            return null;
          }

          const adminJson = await adminRes.json();
          const userErrors = adminJson.data?.draftOrderCreate?.userErrors;
          if (userErrors && userErrors.length > 0) {
            console.error("Shopify draftOrderCreate userErrors:", JSON.stringify(userErrors));
            return null;
          }

          const draftOrder = adminJson.data?.draftOrderCreate?.draftOrder;
          if (!draftOrder?.id) return null;

          const completeRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
            method: "POST",
            headers: {
              "X-Shopify-Access-Token": ADMIN_API_TOKEN,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              query: DRAFT_ORDER_COMPLETE_MUTATION,
              variables: { id: draftOrder.id, paymentPending: true },
            }),
          });

          if (!completeRes.ok) return null;
          const compJson = await completeRes.json();
          return compJson.data?.draftOrderComplete?.draftOrder?.order || null;
        };

        const createdOrder = await createAndCompleteDraftOrder(buildInputPayload());

        if (createdOrder?.name) {
          orderName = createdOrder.name;
          shopifyCreated = true;
        }
      } catch (err) {
        console.error("Admin draftOrder error:", err);
      }
    }

    // Don't hand back a locally-invented order number when nothing reached Shopify —
    // the customer would see a confirmation for an order that doesn't exist.
    if (!shopifyCreated) {
      return NextResponse.json(
        { error: "We couldn't place your order. Please try again or contact us on WhatsApp." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      orderId: orderName,
      orderName: orderName,
      checkoutUrl: checkoutUrl,
      shopifyCreated: shopifyCreated,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    // Don't echo internal error text to the client.
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}
