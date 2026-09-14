import { describe, it, expect, beforeEach } from "vitest";
import { cache } from "@/lib/cache";

describe("MemoryCache", () => {
  beforeEach(() => {
    cache.clear();
  });

  it("should store and retrieve cached values", () => {
    cache.set("test-key", { name: "Jon Snow" }, 60);
    const retrieved = cache.get<{ name: string }>("test-key");
    expect(retrieved).toEqual({ name: "Jon Snow" });
  });

  it("should return null for non-existent keys", () => {
    const value = cache.get("missing-key");
    expect(value).toBeNull();
  });

  it("should delete keys properly", () => {
    cache.set("del-key", "val", 60);
    expect(cache.get("del-key")).toBe("val");
    cache.del("del-key");
    expect(cache.get("del-key")).toBeNull();
  });

  it("should expire values after TTL", async () => {
    // Set 0.05 second TTL
    cache.set("short-key", "fleeting", 0.05);
    expect(cache.get("short-key")).toBe("fleeting");

    await new Promise((r) => setTimeout(r, 60));
    expect(cache.get("short-key")).toBeNull();
  });
});
