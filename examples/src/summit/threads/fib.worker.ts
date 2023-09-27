import { fib } from "../lib";
import { expose } from "threads/worker";

expose({
  compute(n: number): number {
    return fib(n);
  },
});
