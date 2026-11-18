import { describe, it, expect } from "vitest";
import { countWords } from "./projects";
describe("countWords", () => {
  it("counts words across whitespace", () => expect(countWords("  The rain\nfell softly. ")).toBe(4));
  it("is zero for empty text", () => expect(countWords("   ")).toBe(0));
});
