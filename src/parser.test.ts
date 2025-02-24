import { parse } from "./parser";

/* 
  Ok, let's test this out. How could the CSV standard break our parser? 
*/

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

// What if the value has a comma in it?
// Then the cell should be wrapped in double-quotes.
test("cell with comma", () => {
  const gen = parse('"Hello, World"', false);
  const result1 = gen.next();
  expect(result1.done).toBe(false);
  assertNotNull(result1.value);
  expect(result1.value.length).toBe(1);
  expect(result1.value.data[0]).toBe("Hello, World");
});

//  What if the value has a double-quote in it?
//  To get a real double-quote character in the data, double it up like: ""
test("cell with escaped quotes", () => {
  const gen = parse('""Hello!""', false);
  const result1 = gen.next();
  expect(result1.done).toBe(false);
  assertNotNull(result1.value);
  expect(result1.value.length).toBe(1);
  expect(result1.value.data[0]).toBe('"Hello!"');
});

test("cell with escaped quotes and comma", () => {
  const gen = parse('"Hello?, ""Hello!"""', false);
  const result1 = gen.next();
  expect(result1.done).toBe(false);
  assertNotNull(result1.value);
  expect(result1.value.length).toBe(1);
  expect(result1.value.data[0]).toBe('Hello?, "Hello!"');
});

/* TODO 1:
 * 1) Write additional test cases that parses a string containing a special 
      character you think would cause issues.
 * 2) Modify parseCSV_better() so that all the tests pass.
 */
