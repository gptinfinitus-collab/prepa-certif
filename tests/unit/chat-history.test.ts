import { describe, expect, it } from "vitest";
import { orderHistory } from "@/lib/chat.server";

describe("orderHistory", () => {
  it("remet en ordre chronologique une lecture décroissante", () => {
    const rows = [
      { content: "récent", created_at: "2026-01-03" },
      { content: "milieu", created_at: "2026-01-02" },
      { content: "ancien", created_at: "2026-01-01" },
    ];
    expect(orderHistory(rows).map((r) => r.content)).toEqual(["ancien", "milieu", "récent"]);
  });

  it("accepte une absence de résultat", () => {
    expect(orderHistory(null)).toEqual([]);
  });
});
