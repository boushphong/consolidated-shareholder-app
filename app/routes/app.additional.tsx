import { useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";

export const action = async ({ request }: ActionFunctionArgs) => {
  const { admin } = await authenticate.admin(request);

  const response = await admin.graphql(
    `#graphql
      query GetOrders {
        orders(first: 10) {
          edges {
            node {
              id
              name
              metafield(namespace: "custom", key: "customer_note") {
                value
              }
            }
          }
        }
      }
    `
  );

  return await response.json();
};

export default function AdditionalPage() {
  const fetcher = useFetcher<typeof action>();
  const queryOrders = () => fetcher.submit({}, { method: "POST" });

  return (
    <s-page heading="Additional page">
      <s-section heading="View Customer Notes">
        <s-paragraph>
          Click to view orders with customer notes:
        </s-paragraph>
        <s-button onClick={queryOrders}>
          Query Orders
        </s-button>
        {fetcher.data && (
          <s-box padding="base" borderWidth="base" borderRadius="base" background="subdued">
            <pre style={{ margin: 0 }}>
              <code>{JSON.stringify(fetcher.data, null, 2)}</code>
            </pre>
          </s-box>
        )}
      </s-section>

      <s-section slot="aside" heading="Resources">
        <s-unordered-list>
          <s-list-item>
            <s-link
              href="https://shopify.dev/docs/apps/design-guidelines/navigation#app-nav"
              target="_blank"
            >
              App nav best practices
            </s-link>
          </s-list-item>
        </s-unordered-list>
      </s-section>
    </s-page>
  );
}
