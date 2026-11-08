import { describe, it, expect } from "vitest";
import { scaleCards, instruments } from "./scales";

describe("scale flashcard data", () => {
  it("has unique ids", () => {
    const ids = scaleCards.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has the expected number of cards per instrument", () => {
    const count = (id: string) => scaleCards.filter((c) => c.instrument === id).length;
    expect(count("cello")).toBe(8 + 8 + 3 + 2 + 3);
    expect(count("piano")).toBe(10 + 2 + 2 + 1 + 12 + 1);
    expect(count("flute")).toBe(10 + 1 + 1 + 4 + 10 + 4 + 4);
  });

  it("gives every instrument at least one card", () => {
    instruments.forEach((i) => {
      expect(scaleCards.some((c) => c.instrument === i.id)).toBe(true);
    });
  });
});
