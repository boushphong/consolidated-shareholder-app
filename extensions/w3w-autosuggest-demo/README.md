# Customer Note Field - Checkout UI Extension

This is a customer note field checkout UI extension that allows customers to add notes during checkout. The notes are stored as order metafields.

Built with Preact and Shopify's Checkout UI Extensions API.

## Querying the Data

The customer notes can be queried via GraphQL using the following query:

```graphql
query GetOrders {
  orders(first: 10) {
    edges {
      node {
        metafield(namespace: "custom", key: "customer_note") {
          value
        }
      }
    }
  }
}
```

## Others
I attempted to get the note to display on the order admin page but was unable to make it work.
