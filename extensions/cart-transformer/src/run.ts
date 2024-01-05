import type {
  RunInput,
  FunctionRunResult,
} from "../generated/api";

const PRODUCT_ID_TO_REPLACE = "gid://shopify/Product/7781613994202";

type _CartLine = RunInput["cart"]["lines"][number]

const isItemToReplace = (line: _CartLine) =>
  line.merchandise.__typename === "ProductVariant" && line.merchandise.product.id === PRODUCT_ID_TO_REPLACE;

const getReplaceWithVariantId = (line: _CartLine) =>
  line.merchandise.__typename === 'ProductVariant' ? line.merchandise.metafield?.value : null;

export function run(input: RunInput): FunctionRunResult {
  // return { operations: [] };
  const result: FunctionRunResult = {
    operations: [],
  };

  for (const line of input.cart.lines) {
    const replaceWithId = getReplaceWithVariantId(line);
    if (!isItemToReplace(line) || !replaceWithId) continue;

    result.operations.push({
      expand: {
        cartLineId: line.id,
        expandedCartItems: [
          {
            merchandiseId: replaceWithId,
            quantity: line.quantity * 3,
          }
        ]
      }
    })
  }

  return result;
}
