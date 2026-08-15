import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { shippingAddress, paymentMethod, lineItems } = body;

    if (!lineItems || lineItems.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!shippingAddress || !shippingAddress.firstName || !shippingAddress.phone || !shippingAddress.address1 || !shippingAddress.city) {
      return NextResponse.json({ error: "Missing shipping address details" }, { status: 400 });
    }

    let orderName = `VSD-${Math.floor(100000 + Math.random() * 900000)}`;
    let checkoutUrl = "";
    let shopifyCreated = false;

    // 1. Try Storefront API cartCreate to generate native Shopify checkoutUrl
    if (STOREFRONT_TOKEN) {
      try {
        const storefrontLines = lineItems.map((item: any) => {
          let cleanId = item.variantId;
          if (cleanId && !cleanId.startsWith("gid://shopify/")) {
            const digits = cleanId.replace(/\D/g, "");
            if (digits) cleanId = `gid://shopify/ProductVariant/${digits}`;
          }
          return {
            merchandiseId: cleanId || "gid://shopify/ProductVariant/44760086216951",
            quantity: parseInt(item.quantity || "1", 10),
          };
        });

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

    // 2. Try Admin API Draft Order creation
    if (ADMIN_API_TOKEN) {
      try {
        const formattedLineItems = lineItems.map((item: any) => {
          let finalVariantId = item.variantId;
          if (finalVariantId && !finalVariantId.startsWith("gid://shopify/")) {
            const cleanId = finalVariantId.replace(/\D/g, "");
            if (cleanId) finalVariantId = `gid://shopify/ProductVariant/${cleanId}`;
          }

          if (finalVariantId) {
            return {
              variantId: finalVariantId,
              quantity: parseInt(item.quantity || "1", 10),
            };
          } else {
            return {
              title: item.name || "Vape Product",
              originalUnitPrice: parseFloat(item.price || "0"),
              quantity: parseInt(item.quantity || "1", 10),
            };
          }
        });

        const input = {
          lineItems: formattedLineItems,
          shippingAddress: {
            firstName: shippingAddress.firstName,
            lastName: shippingAddress.lastName || "",
            address1: shippingAddress.address1,
            city: shippingAddress.city,
            phone: shippingAddress.phone,
            country: "United Arab Emirates",
          },
          note: `Payment Method: ${paymentMethod}`,
          customAttributes: [
            { key: "Payment Method", value: paymentMethod },
            { key: "Checkout Source", value: "Headless Web Store" },
          ],
        };

        const adminRes = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
          method: "POST",
          headers: {
            "X-Shopify-Access-Token": ADMIN_API_TOKEN,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            query: DRAFT_ORDER_MUTATION,
            variables: { input },
          }),
        });

        if (adminRes.ok) {
          const adminJson = await adminRes.json();
          const draftOrder = adminJson.data?.draftOrderCreate?.draftOrder;

          if (draftOrder?.id) {
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

            if (completeRes.ok) {
              const compJson = await completeRes.json();
              const completedOrder = compJson.data?.draftOrderComplete?.draftOrder?.order;
              if (completedOrder?.name) {
                orderName = completedOrder.name;
                shopifyCreated = true;
              }
            }
          }
        }
      } catch (err) {
        console.warn("Admin draftOrder error:", err);
      }
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
    return NextResponse.json({ error: error.message || "Checkout failed" }, { status: 500 });
  }
}
