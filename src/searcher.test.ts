import { EOL } from "os";
import { search_basic, search_better} from "./searcher";

/**
 * TypeScript won't narrow using expectations, so we need to bridge the gap. This is a TypeScript
 * assertion function, which tells TypeScript that the given value is of the expected type if the
 * function returns rather than throwing an error.
 *
 * The type parameter allows TypeScript to conclude that the value has type T, for some T.
 *
 * See:
 * https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-7.html#assertion-functions
 */
function assertNotNull<T>(v: T | null): asserts v is T {
  if (v == null) {
    throw new Error(`value was null`);
  }
}

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

test("standard search", () => {
  const gen = search_basic(
    `name,age,city${EOL}Alice,25,New York${EOL}Bob,30,Chicago${EOL}Charlie,35,Los Angeles${EOL}David,40,New York`,
    true,
    "New York"
  );

  expect(gen).toEqual([
    ["Alice", "25", "New York"],
    ["David", "40", "New York"],
  ]);
});

test("standard search with searchCSV_better", () => {
  const gen = search_better(
    `name,age,city${EOL}Alice,25,New York${EOL}Bob,30,Chicago${EOL}Charlie,35,Los Angeles${EOL}David,40,New York`, true,
    "New York"
  );

  const results = Array.from(gen);

  expect(results).toEqual([
    ["Alice", "25", "New York"],
    ["David", "40", "New York"],
  ]);
});