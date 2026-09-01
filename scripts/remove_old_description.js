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
  console.log("Fetching Metaobject Definition...");
  const getDefsQuery = `
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

  const defsRes = await shopifyAdminQuery(getDefsQuery);
  const existing = defsRes.data?.metaobjectDefinitions?.edges?.find(e => e.node.type === "juul_feature");

  if (!existing) {
    console.error("juul_feature not found");
    return;
  }

  const defId = existing.node.id;

  console.log("Deleting old plain text 'description' field and updating 'description_rich' name to 'Description'...");

  const updateMutation = `
    mutation UpdateMetaobjectDefinition($id: ID!, $definition: MetaobjectDefinitionUpdateInput!) {
      metaobjectDefinitionUpdate(id: $id, definition: $definition) {
        metaobjectDefinition {
          id
          type
          fieldDefinitions {
            key
            name
            type { name }
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const updateInput = {
    fieldDefinitions: [
      {
        delete: {
          key: "description"
        }
      },
      {
        update: {
          key: "description_rich",
          name: "Description"
        }
      }
    ]
  };

  const updateRes = await shopifyAdminQuery(updateMutation, { id: defId, definition: updateInput });
  console.log("Update Response:", JSON.stringify(updateRes, null, 2));
}

run().catch(console.error);
