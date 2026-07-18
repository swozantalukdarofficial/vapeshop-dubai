import { NextResponse } from "next/server";

const SHOPIFY_STORE = process.env.SHOPIFY_STORE!;
const ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN!;

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

    // Format line items for Shopify
    const formattedLineItems = lineItems.map((item: any) => {
      let finalVariantId = item.variantId;
      
      // If variantId is present but doesn't have the GraphQL prefix, prepend it
      if (finalVariantId && !finalVariantId.startsWith("gid://shopify/")) {
        // Remove non-numeric characters if it's just numbers
        const cleanId = finalVariantId.replace(/\D/g, "");
        if (cleanId) {
          finalVariantId = `gid://shopify/ProductVariant/${cleanId}`;
        }
      }

      if (finalVariantId) {
        return {
          variantId: finalVariantId,
          quantity: parseInt(item.quantity || "1", 10),
        };
      } else {
        // Fallback to custom item to ensure order successfully goes through in Shopify
        return {
          title: item.name || "Vape Product",
          originalUnitPrice: parseFloat(item.price || "0"),
          quantity: parseInt(item.quantity || "1", 10),
        };
      }
    });

    // Setup input
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
        {
          key: "Payment Method",
          value: paymentMethod,
        },
        {
          key: "Checkout Source",
          value: "Custom Headless Checkout",
        }
      ],
    };

    // Call Shopify Admin GraphQL API
    const url = `https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`;
    const response = await fetch(url, {
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

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const result = await response.json();
    if (result.errors) {
      throw new Error(`Shopify GraphQL errors: ${JSON.stringify(result.errors)}`);
    }

    const userErrors = result.data?.draftOrderCreate?.userErrors || [];
    if (userErrors.length > 0) {
      return NextResponse.json({ success: false, errors: userErrors }, { status: 400 });
    }

    const draftOrder = result.data?.draftOrderCreate?.draftOrder;
    if (!draftOrder || !draftOrder.id) {
      throw new Error("Failed to retrieve draft order ID");
    }

    // Convert the Draft Order into a real Order (Payment Pending for COD)
    const completeResponse = await fetch(url, {
      method: "POST",
      headers: {
        "X-Shopify-Access-Token": ADMIN_API_TOKEN,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: DRAFT_ORDER_COMPLETE_MUTATION,
        variables: {
          id: draftOrder.id,
          paymentPending: true,
        },
      }),
    });

    let orderName = draftOrder.name;

    if (completeResponse.ok) {
      const completeResult = await completeResponse.json();
      const completeUserErrors = completeResult.data?.draftOrderComplete?.userErrors || [];
      if (completeUserErrors.length === 0) {
        const completedOrder = completeResult.data?.draftOrderComplete?.draftOrder?.order;
        if (completedOrder && completedOrder.name) {
          orderName = completedOrder.name;
        }
      } else {
        console.error("Draft Order completion user errors:", completeUserErrors);
      }
    } else {
      console.error("Draft Order completion HTTP error:", completeResponse.statusText);
    }

    return NextResponse.json({
      success: true,
      orderId: draftOrder.id,
      orderName: orderName,
    });
  } catch (error: any) {
    console.error("Checkout API error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
