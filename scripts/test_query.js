require('dotenv').config({ path: '.env.local' });

async function check() {
  const query = `
    query {
      products(first: 5, query: "title:*Peach*") {
        edges {
          node {
            id
            title
            handle
            juulFeature1Meta: metafield(namespace: "custom", key: "juul_feature_1") {
              id
              value
              type
              reference {
                ... on Metaobject {
                  id
                  type
                  fields {
                    key
                    value
                    reference {
                      ... on MediaImage {
                        image { url }
                      }
                      ... on GenericFile {
                        url
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${process.env.SHOPIFY_STORE}/admin/api/2024-10/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": process.env.SHOPIFY_ADMIN_API_TOKEN,
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  console.log(JSON.stringify(json, null, 2));
}

check().catch(console.error);
