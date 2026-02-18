export type ParsedIntent =
  | {
      kind: "swap";
      summary: string;
      tokenIn: string;
      tokenOut: string;
      amountIn: number;
    }
  | {
      kind: "limit";
      summary: string;
      tokenIn: string;
      tokenOut: string;
      amountIn: number;
      limitPriceUsd: number;
    }
  | {
      kind: "dca";
      summary: string;
      tokenIn: string;
      tokenOut: string;
      amountPerOrder: number;
      frequencyValue: number;
      frequencyUnit: "minutes" | "hours" | "days";
      totalOrders: number;
    }
  | {
      kind: "multi";
      summary: string;
      receiveToken: string;
      assets: Array<{ token: string; amount: number }>;
    }
  | {
      kind: "split";
      summary: string;
      tokenIn: string;
      amountIn: number;
      allocations: Array<{ token: string; percentage: number }>;
    };

export type ParsedIntentResult =
  | {
      ok: true;
      intent: ParsedIntent;
    }
  | {
      ok: false;
      error: string;
    };

function parsePositiveNumber(value: string): number | null {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return parsed;
}

function parseUnit(value: string): "minutes" | "hours" | "days" | null {
  const normalized = value.trim().toLowerCase();
  if (normalized.startsWith("minute")) {
    return "minutes";
  }
  if (normalized.startsWith("hour")) {
    return "hours";
  }
  if (normalized.startsWith("day")) {
    return "days";
  }
  return null;
}

export function parseNaturalLanguageIntent(input: string): ParsedIntentResult {
  const normalized = input.trim();
  if (!normalized) {
    return { ok: false, error: "Intent text is required." };
  }

  const limitPattern =
    /^swap\s+([0-9]+(?:\.[0-9]+)?)\s+([a-zA-Z0-9]+)\s+to\s+([a-zA-Z0-9]+)\s+when\s+(?:the\s+)?price\s+reaches\s+\$?([0-9]+(?:\.[0-9]+)?)$/i;
  const limitMatch = normalized.match(limitPattern);
  if (limitMatch) {
    const amountIn = parsePositiveNumber(limitMatch[1]);
    const limitPrice = parsePositiveNumber(limitMatch[4]);
    if (!amountIn || !limitPrice) {
      return { ok: false, error: "Limit intent has invalid numeric values." };
    }
    const tokenIn = limitMatch[2].toUpperCase();
    const tokenOut = limitMatch[3].toUpperCase();
    return {
      ok: true,
      intent: {
        kind: "limit",
        summary: `Intent limit: swap ${amountIn} ${tokenIn} to ${tokenOut} when price reaches $${limitPrice}`,
        tokenIn,
        tokenOut,
        amountIn,
        limitPriceUsd: limitPrice,
      },
    };
  }

  const dcaPattern =
    /^dca\s+([0-9]+(?:\.[0-9]+)?)\s+([a-zA-Z0-9]+)\s+to\s+([a-zA-Z0-9]+)\s+every\s+([0-9]+)\s+(minutes?|hours?|days?)\s+for\s+([0-9]+)\s+orders?$/i;
  const dcaMatch = normalized.match(dcaPattern);
  if (dcaMatch) {
    const amountPerOrder = parsePositiveNumber(dcaMatch[1]);
    const frequencyValue = parsePositiveNumber(dcaMatch[4]);
    const totalOrders = parsePositiveNumber(dcaMatch[6]);
    const frequencyUnit = parseUnit(dcaMatch[5]);
    if (!amountPerOrder || !frequencyValue || !totalOrders || !frequencyUnit) {
      return { ok: false, error: "DCA intent has invalid values." };
    }
    const tokenIn = dcaMatch[2].toUpperCase();
    const tokenOut = dcaMatch[3].toUpperCase();
    return {
      ok: true,
      intent: {
        kind: "dca",
        summary: `Intent dca: ${amountPerOrder} ${tokenIn} to ${tokenOut} every ${frequencyValue} ${frequencyUnit} for ${totalOrders} orders`,
        tokenIn,
        tokenOut,
        amountPerOrder,
        frequencyValue: Math.floor(frequencyValue),
        frequencyUnit,
        totalOrders: Math.floor(totalOrders),
      },
    };
  }

  const swapPattern = /^swap\s+([0-9]+(?:\.[0-9]+)?)\s+([a-zA-Z0-9]+)\s+to\s+([a-zA-Z0-9]+)$/i;
  const swapMatch = normalized.match(swapPattern);
  if (swapMatch) {
    const amountIn = parsePositiveNumber(swapMatch[1]);
    if (!amountIn) {
      return { ok: false, error: "Swap intent has invalid amount." };
    }
    const tokenIn = swapMatch[2].toUpperCase();
    const tokenOut = swapMatch[3].toUpperCase();
    return {
      ok: true,
      intent: {
        kind: "swap",
        summary: `Intent swap: ${amountIn} ${tokenIn} to ${tokenOut}`,
        tokenIn,
        tokenOut,
        amountIn,
      },
    };
  }

  const splitPattern = /^convert\s+([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z0-9]+)\s+to\s+(.+)$/i;
  const splitMatch = normalized.match(splitPattern);
  if (splitMatch) {
    const amountIn = parsePositiveNumber(splitMatch[1]);
    if (!amountIn) {
      return { ok: false, error: "Split intent has invalid amount." };
    }
    const tokenIn = splitMatch[2].toUpperCase();
    const allocationsText = splitMatch[3];

    const allocationParts = allocationsText
      .split(/,\s*and\s+|,\s+|\s+and\s+/)
      .map((part) => part.replace(/\bremaining\b/gi, "").trim())
      .filter((part) => part.length > 0);

    const allocations: Array<{ token: string; percentage: number }> = [];
    for (const part of allocationParts) {
      const allocationMatch = part.match(/([0-9]+(?:\.[0-9]+)?)\s*%\s*(?:to\s+)?([a-zA-Z0-9]+)/i);
      if (!allocationMatch) {
        return { ok: false, error: `Could not parse allocation segment: "${part}"` };
      }
      const percentage = parsePositiveNumber(allocationMatch[1]);
      if (!percentage) {
        return { ok: false, error: `Invalid percentage in segment: "${part}"` };
      }
      allocations.push({
        percentage,
        token: allocationMatch[2].toUpperCase(),
      });
    }

    const totalPercentage = allocations.reduce((sum, alloc) => sum + alloc.percentage, 0);
    if (Math.abs(totalPercentage - 100) > 0.01) {
      return { ok: false, error: `Percentages must sum to 100% (got ${totalPercentage}%)` };
    }

    return {
      ok: true,
      intent: {
        kind: "split",
        summary: `Intent split: convert ${amountIn} ${tokenIn} to ${allocations
          .map((alloc) => `${alloc.percentage}% ${alloc.token}`)
          .join(", ")}`,
        tokenIn,
        amountIn,
        allocations,
      },
    };
  }

  const multiPattern = /^convert\s+(.+)\s+to\s+([a-zA-Z0-9]+)$/i;
  const multiMatch = normalized.match(multiPattern);
  if (multiMatch) {
    const receiveToken = multiMatch[2].toUpperCase();
    const assetsRaw = multiMatch[1].replace(/\ball\b/gi, "").replace(/\bal\b/gi, "");
    const parts = assetsRaw
      .split(",")
      .map((value) => value.trim())
      .filter((value) => value.length > 0);

    if (parts.length < 2) {
      return { ok: false, error: "Multi intent requires at least 2 input assets." };
    }

    const assets: Array<{ token: string; amount: number }> = [];
    for (const part of parts) {
      const itemMatch = part.match(/^([0-9]+(?:\.[0-9]+)?)\s*([a-zA-Z0-9]+)$/i);
      if (!itemMatch) {
        return { ok: false, error: `Could not parse multi asset segment: "${part}"` };
      }
      const amount = parsePositiveNumber(itemMatch[1]);
      if (!amount) {
        return { ok: false, error: `Invalid amount in segment: "${part}"` };
      }
      assets.push({
        amount,
        token: itemMatch[2].toUpperCase(),
      });
    }

    return {
      ok: true,
      intent: {
        kind: "multi",
        summary: `Intent multi: convert ${assets
          .map((asset) => `${asset.amount} ${asset.token}`)
          .join(", ")} to ${receiveToken}`,
        receiveToken,
        assets,
      },
    };
  }

  return {
    ok: false,
    error:
      "Unsupported intent format. Use strict patterns like: `swap 100 WETH to POL`, `swap 100 WETH to POL when price reaches 3500`, `dca 100 WETH to POL every 5 minutes for 4 orders`, `convert 100 WETH to 50% POL and 50% USDT`, or `convert 100 WETH, 500 POL, 1000 USDC to USDT`.",
  };
}

