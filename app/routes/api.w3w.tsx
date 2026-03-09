// Import from the new unified package

export async function loader() {
  // 1. You can access the request (e.g., URL params)
  // 2. Perform server-side logic (e.g., Database or Shopify API calls)

  return {
    items: ["Product A", "Product B"],
    shop: "your-store.myshopify.com"
  };
}
