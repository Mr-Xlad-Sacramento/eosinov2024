import { afterEach, describe, expect, it, vi } from "vitest";

import { apiGetWithFallback, wsBaseUrl } from "./client";

describe("api client", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to the second path when the first request fails", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockRejectedValueOnce(new Error("network down"))
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ tvl: "1.0" }), {
          status: 200,
          headers: { "content-type": "application/json" },
        }),
      );

    const result = await apiGetWithFallback<{ tvl: string }>([
      "/api/v1/analytics/tvl",
      "/api/analytics/tvl",
    ]);

    expect(result.tvl).toBe("1.0");
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it("builds websocket URL from API base URL", () => {
    const wsUrl = wsBaseUrl();
    expect(wsUrl.startsWith("ws://") || wsUrl.startsWith("wss://")).toBe(true);
  });
});
