/*
  This module contains code for searching CSV files. 

  Note the tsconfig.json for this project, which enables some checking that is disabled 
  by default. In particular, "noUncheckedIndexedAccess" needs some discussion in 
  comments below.
*/

/** EOL will be the local operating-system line separator. */
import { EOL } from "os";
import { parse } from "./parser";

/**
 * A very naive CSV searcher. There are a few weaknesses here.
 *   (1) It assumes the input is in string form, which is very "eager": a large file would need to be
 *       fully loaded even if we only wanted to get the first row, and an infinite stream of datapoints
 *       couldn't be used at all. We'd like something we can get row-by-row from, on demand.
 *   (2) It is all-or-nothing: I can't just ask for a single datapoint at a time, but instead have to
 *       wait for them all to be extracted and converted. This is related to (3) above, but different.
 *
 * Note that when we did this in Java, we used the strategy pattern to add a converter function. However,
 * if we aren't shy about using "map", we will assume our caller won't be either.
 *
 * @param input The CSV-formatted data to parse
 * @returns an array of datapoints, each of which is represented as an array of strings (1 for each column)
 */
function searchCSV_basic(
  input: string,
  header: boolean,
  value: string,
  column?: string
): string[][] {
  const results: string[][] = [];
  const parser = parse(input, header);

  for (const row of parser) {
    const rowData = row.data;
    if (!rowData) {
      continue;
    }

    if (column) {
      if (rowData[column] === value) {
        results.push(
          Object.entries(rowData)
            // Keep only entries whose keys are not numeric
            .filter(([key]) => isNaN(Number(key)))
            .map(([, value]) => value || "")
        );
      }
    } else {
      if (Object.values(rowData).includes(value)) {
        results.push(
          Object.entries(rowData)
            // Keep only entries whose keys are not numeric
            .filter(([key]) => isNaN(Number(key)))
            .map(([, value]) => value || "")
        );
      }
    }
  }

  return results;
}

/* TODO 2: Implement a modified version of searchCSV_basic that addresses the all-or-nothing concern
 * so that we don't have to wait for the entire file to be parsed before returning searched values.
 * HINT: Use 'yield'. Check out parseCSV_better() for an example
 */
function* searchCSV_better(
  input: string,
  header: boolean,
  searchValue: string,
  column?: string
): Generator<string[], null> {
  // Fill me in!
  return null;
}



// Export only the latest of our works in progress to other modules.
export { searchCSV_basic as search_basic };
export { searchCSV_better as search_better };