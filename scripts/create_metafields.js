require('dotenv').config({ path: '.env.local' });

const SHOPIFY_STORE = process.env.SHOPIFY_STORE || "vap-shop-dubai.myshopify.com";
const SHOPIFY_ADMIN_API_TOKEN = process.env.SHOPIFY_ADMIN_API_TOKEN;

async function shopifyAdminQuery(query, variables = {}) {
  const res = await fetch(`https://${SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": SHOPIFY_ADMIN_API_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });
  return await res.json();
}

async function run() {
  console.log("Creating Metaobject Definition...");

  const createMetaobjectDefMutation = `
    mutation CreateMetaobjectDefinition($definition: MetaobjectDefinitionCreateInput!) {
      metaobjectDefinitionCreate(definition: $definition) {
        metaobjectDefinition {
          id
          type
          name
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metaobjectInput = {
    name: "Juul Feature",
    type: "juul_feature",
    fieldDefinitions: [
      { key: "title", name: "Title", type: "single_line_text_field" },
      { key: "description", name: "Description", type: "multi_line_text_field" },
      { key: "button_text", name: "Button Text", type: "single_line_text_field" },
      { key: "button_link", name: "Button Link", type: "url" },
      { key: "image", name: "Image", type: "file_reference", validations: [{ name: "file_type_options", value: "[\"Image\"]" }] },
      { key: "bullet_points", name: "Bullet Points", type: "list.single_line_text_field" },
    ],
  };

  let res = await shopifyAdminQuery(createMetaobjectDefMutation, { definition: metaobjectInput });
  console.log("Metaobject Def Response:", JSON.stringify(res, null, 2));

  let metaobjectDefId = res.data?.metaobjectDefinitionCreate?.metaobjectDefinition?.id;

  if (!metaobjectDefId) {
    console.log("Checking if Metaobject definition already exists...");
    const getMetaobjectDefsQuery = `
      query {
        metaobjectDefinitions(first: 50) {
          edges {
            node {
              id
              type
              name
            }
          }
        }
      }
    `;
    const defsRes = await shopifyAdminQuery(getMetaobjectDefsQuery);
    const existing = defsRes.data?.metaobjectDefinitions?.edges?.find(e => e.node.type === "juul_feature");
    if (existing) {
      metaobjectDefId = existing.node.id;
      console.log("Found existing Metaobject Def ID:", metaobjectDefId);
    }
  }

  if (!metaobjectDefId) {
    console.error("Could not get Metaobject Definition ID");
    return;
  }

  console.log("Creating Product Metafield Definition 1...");
  const createMetafieldDefMutation = `
    mutation CreateMetafieldDefinition($definition: MetafieldDefinitionInput!) {
      metafieldDefinitionCreate(definition: $definition) {
        createdDefinition {
          id
          name
          key
          namespace
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const metafield1Input = {
    name: "Juul Feature 1",
    namespace: "custom",
    key: "juul_feature_1",
    ownerType: "PRODUCT",
    type: "metaobject_reference",
    validations: [
      {
        name: "metaobject_definition_id",
        value: metaobjectDefId,
      },
    ],
  };

  res = await shopifyAdminQuery(createMetafieldDefMutation, { definition: metafield1Input });
  console.log("Metafield 1 Response:", JSON.stringify(res, null, 2));

  console.log("Creating Product Metafield Definition 2...");
  const metafield2Input = {
    name: "Juul Feature 2",
    namespace: "custom",
    key: "juul_feature_2",
    ownerType: "PRODUCT",
    type: "metaobject_reference",
    validations: [
      {
        name: "metaobject_definition_id",
        value: metaobjectDefId,
      },
    ],
  };

  res = await shopifyAdminQuery(createMetafieldDefMutation, { definition: metafield2Input });
  console.log("Metafield 2 Response:", JSON.stringify(res, null, 2));
}

run().catch(console.error);
