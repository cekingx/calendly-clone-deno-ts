import { assertEquals } from "@std/assert";
import { add } from "./main.ts";
import { describe, it } from "@std/testing/bdd";

describe("Add", () => {
  it("should add two numbers", () => {
    assertEquals(add(1, 2), 3);
  });
});
