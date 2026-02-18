import { afterEach, describe, expect, it, vi } from "vitest";

import { standrApi } from "./standr";

const sampleReport = {
  generated_at: 1739210400,
  execution_mode: "simulation",
  verified_count: 2,
  missing_count: 1,
  bindings: [
    {
      feature_key: "yield.executeLeverageLending",
      domain: "yield",
      backend_route: "/api/v1/yield/leverage-lending/execute",
      backend_method: "POST",
      contract_name: "YieldAggregatorEnhanced",
      function_signature: "executeLeverageLending(uint256,uint256)",
      required_for_demo: true,
      supports_onchain_execution: false,
      validation: {
        status: "route_present_simulation",
        route_exists: true,
        contract_artifact_exists: true,
        function_signature_exists: true,
      },
    },
  ],
};

describe("standrApi.getWiringReport", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns v1 wiring payload when v1 route succeeds", async () => {
    const fetchMock = vi
      .spyOn(globalThis, "fetch")
      .mockImplementation((input: RequestInfo | URL) => {
        const url = String(input);
        if (url.includes("/api/v1/analytics/wiring")) {
          return Promise.resolve(
            new Response(JSON.stringify(sampleReport), {
              status: 200,
              headers: { "content-type": "application/json" },
            }),
          );
        }
        return Promise.resolve(
          new Response("legacy not used", {
            status: 404,
            headers: { "content-type": "text/plain" },
          }),
        );
      });

    const result = await standrApi.getWiringReport();
    expect(result.execution_mode).toBe("simulation");
    expect(result.bindings[0].feature_key).toBe("yield.executeLeverageLending");
    expect(fetchMock).toHaveBeenCalled();
  });

  it("falls back to legacy route when v1 fails", async () => {
    vi.spyOn(globalThis, "fetch").mockImplementation((input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/api/v1/analytics/wiring")) {
        return Promise.resolve(
          new Response("missing", {
            status: 404,
            headers: { "content-type": "text/plain" },
          }),
        );
      }
      if (url.includes("/api/analytics/wiring")) {
        return Promise.resolve(
          new Response(JSON.stringify(sampleReport), {
            status: 200,
            headers: { "content-type": "application/json" },
          }),
        );
      }
      return Promise.resolve(new Response("not found", { status: 404 }));
    });

    const result = await standrApi.getWiringReport();
    expect(result.verified_count).toBe(2);
    expect(result.missing_count).toBe(1);
  });
});
