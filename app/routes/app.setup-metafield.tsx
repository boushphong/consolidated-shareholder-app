import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  // First, get the existing metafield definition ID
  const getDefinitionResponse = await admin.graphql(
    `#graphql
      query GetMetafieldDefinition {
        metafieldDefinitions(first: 100, ownerType: ORDER) {
          edges {
            node {
              id
              name
              namespace
              key
              pinnedPosition
            }
          }
        }
      }
    `
  );

  const getDefinitionJson = await getDefinitionResponse.json();
  const existingDefinition = getDefinitionJson.data?.metafieldDefinitions?.edges?.find(
    (edge: any) => edge.node.namespace === "custom" && edge.node.key === "customer_note"
  );

  if (existingDefinition) {
    // Update existing definition to pin it
    const response = await admin.graphql(
      `#graphql
        mutation UpdateMetafieldDefinition($id: ID!) {
          metafieldDefinitionUpdate(definition: {
            id: $id
            pin: true
          }) {
            updatedDefinition {
              id
              name
              namespace
              key
              pinnedPosition
            }
            userErrors {
              field
              message
            }
          }
        }
      `,
      {
        variables: {
          id: existingDefinition.node.id,
        },
      }
    );
    return await response.json();
  }

  // If it doesn't exist, create it
  const response = await admin.graphql(
    `#graphql
      mutation CreateMetafieldDefinition {
        metafieldDefinitionCreate(definition: {
          name: "Customer Note"
          namespace: "custom"
          key: "customer_note"
          type: "single_line_text_field"
          ownerType: ORDER
          pin: true
        }) {
          createdDefinition {
            id
            name
            namespace
            key
          }
          userErrors {
            field
            message
          }
        }
      }
    `
  );

  const responseJson = await response.json();

  return responseJson;
};
