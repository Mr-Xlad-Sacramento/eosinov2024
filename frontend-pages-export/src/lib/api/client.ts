import { API_BASE_URL } from "@/lib/constants";

const API_KEY = process.env.NEXT_PUBLIC_STANDR_API_KEY;
const API_TIMEOUT_MS = (() => {
  const raw = Number(process.env.NEXT_PUBLIC_STANDR_API_TIMEOUT_MS ?? "1200");
  if (!Number.isFinite(raw) || raw < 250) {
    return 1200;
  }
  return Math.round(raw);
})();
const FALLBACK_SUCCESS_INDEX = new Map<string, number>();

function joinUrl(path: string): string {
  const base = API_BASE_URL.endsWith("/") ? API_BASE_URL.slice(0, -1) : API_BASE_URL;
  const suffix = path.startsWith("/") ? path : `/${path}`;
  return `${base}${suffix}`;
}

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = await response.text();
    throw new Error(`HTTP ${response.status} ${response.statusText}: ${body}`);
  }
  const contentType = response.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return (await response.json()) as T;
  }
  return (await response.text()) as T;
}

function buildHeaders(initHeaders?: HeadersInit): Headers {
  const headers = new Headers(initHeaders);
  if (API_KEY) {
    headers.set("x-api-key", API_KEY);
  }
  return headers;
}

function createTimeoutController(init?: RequestInit): {
  init: RequestInit;
  clear: () => void;
} {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  const externalSignal = init?.signal;
  if (externalSignal) {
    if (externalSignal.aborted) {
      controller.abort();
    } else {
      externalSignal.addEventListener("abort", () => controller.abort(), { once: true });
    }
  }

  return {
    init: {
      ...init,
      signal: controller.signal,
    },
    clear: () => clearTimeout(timeoutId),
  };
}

export async function apiGet<T>(path: string, init?: RequestInit): Promise<T> {
  const timeout = createTimeoutController(init);

  try {
    const response = await fetch(joinUrl(path), {
      ...timeout.init,
      method: "GET",
      cache: "no-store",
      headers: buildHeaders(timeout.init.headers),
    });
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    timeout.clear();
  }
}

export async function apiPost<T>(
  path: string,
  body: unknown,
  init?: RequestInit,
): Promise<T> {
  const timeout = createTimeoutController(init);
  const headers = buildHeaders(timeout.init.headers);
  headers.set("content-type", "application/json");

  try {
    const response = await fetch(joinUrl(path), {
      ...timeout.init,
      method: "POST",
      cache: "no-store",
      headers,
      body: JSON.stringify(body),
    });
    return parseResponse<T>(response);
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error(`Request timeout after ${API_TIMEOUT_MS}ms`);
    }
    throw error;
  } finally {
    timeout.clear();
  }
}

export async function apiGetWithFallback<T>(paths: string[]): Promise<T> {
  if (paths.length === 0) {
    throw new Error("no fallback paths supplied");
  }
  if (paths.length === 1) {
    return apiGet<T>(paths[0]);
  }

  const cacheKey = paths.join("|");
  const preferredIndex = FALLBACK_SUCCESS_INDEX.get(cacheKey);
  const ordered = [...paths.keys()].sort((left, right) => {
    if (preferredIndex === undefined) {
      return left - right;
    }
    if (left === preferredIndex) {
      return -1;
    }
    if (right === preferredIndex) {
      return 1;
    }
    return left - right;
  });

  const controllers = ordered.map(() => new AbortController());
  const attempts = ordered.map((pathIndex, attemptIndex) =>
    apiGet<T>(paths[pathIndex], { signal: controllers[attemptIndex].signal })
      .then((value) => ({ value, pathIndex }))
      .catch((error) => {
        throw { error, pathIndex };
      }),
  );

  try {
    const winner = await Promise.any(attempts);
    FALLBACK_SUCCESS_INDEX.set(cacheKey, winner.pathIndex);
    controllers.forEach((controller, attemptIndex) => {
      if (ordered[attemptIndex] !== winner.pathIndex) {
        controller.abort();
      }
    });
    return winner.value;
  } catch (error) {
    if (error instanceof AggregateError && error.errors.length > 0) {
      const first = error.errors[0] as { error?: unknown };
      throw first.error ?? error;
    }
    throw error;
  }
}

export function wsBaseUrl(): string {
  if (API_BASE_URL.startsWith("https://")) {
    return API_BASE_URL.replace("https://", "wss://");
  }
  return API_BASE_URL.replace("http://", "ws://");
}
