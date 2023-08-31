/**
 * Example Fib calculation script which should be run on the provider
 */
import assert from "assert";

function fib(n: number): number {
  assert(n >= 0, "The fib n param has to be greater than 0");

  if (n === 0) {
    return 0;
  } else if (n === 1 || n === 2) {
    return 1;
  } else {
    return fib(n - 1) + fib(n - 2);
  }
}

const input = parseInt(process.argv[2]);
const start = Date.now();
const value = fib(parseInt(process.argv[2]));
const durationMs = Date.now() - start;

console.log(
  JSON.stringify({
    input,
    value,
    durationMs,
  }),
);
