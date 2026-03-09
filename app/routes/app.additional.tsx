import { useFetcher } from "react-router";
import type { ActionFunctionArgs } from "react-router";
import { authenticate } from "../shopify.server";
import { useEffect } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

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
  const shopify = useAppBridge();

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

      <s-section heading="Multiple pages">
        <s-paragraph>
          The app template comes with an additional page which demonstrates how
          to create multiple pages within app navigation using{" "}
          <s-link
            href="https://shopify.dev/docs/apps/tools/app-bridge"
            target="_blank"
          >
            App Bridge
          </s-link>
          .
        </s-paragraph>
        <s-paragraph>
          To create your own page and have it show up in the app navigation, add
          a page inside <code>app/routes</code>, and a link to it in the{" "}
          <code>&lt;ui-nav-menu&gt;</code> component found in{" "}
          <code>app/routes/app.jsx</code>.
        </s-paragraph>
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
