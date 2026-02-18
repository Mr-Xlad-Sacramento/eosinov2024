"use client";

import { useEffect, useMemo, useState } from "react";

import { wsBaseUrl } from "@/lib/api/client";
import type { WsEnvelope } from "@/lib/types/domain";

const CHANNELS = [
  "prices",
  "orders",
  "fills",
  "liquidations",
  "funding",
  "blocks",
] as const;

type Channel = (typeof CHANNELS)[number];

export function WsMonitor() {
  const [channel, setChannel] = useState<Channel>("blocks");
  const [messages, setMessages] = useState<WsEnvelope[]>([]);
  const [connected, setConnected] = useState(false);

  useEffect(() => {
    const endpoint = `${wsBaseUrl()}/ws`;
    const socket = new WebSocket(endpoint);

    socket.onopen = () => {
      setConnected(true);
      socket.send(JSON.stringify({ type: "subscribe", channel }));
    };

    socket.onclose = () => {
      setConnected(false);
    };

    socket.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as WsEnvelope;
        if (message.channel === channel || message.type === "connected") {
          setMessages((prev) => [message, ...prev].slice(0, 8));
        }
      } catch {
        // Ignore malformed websocket payloads.
      }
    };

    return () => {
      if (socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: "unsubscribe", channel }));
      }
      socket.close();
    };
  }, [channel]);

  const statusText = useMemo(() => (connected ? "connected" : "disconnected"), [connected]);

  return (
    <article className="space-y-4 rounded-2xl border border-line bg-panel p-4">
      <header className="flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-lg font-semibold">WebSocket Monitor</h2>
        <span className="rounded-full border border-line bg-panel-strong px-3 py-1 text-xs uppercase tracking-[0.12em] text-muted">
          {statusText}
        </span>
      </header>

      <label className="text-sm text-muted" htmlFor="ws-channel-select">
        Channel
      </label>
      <select
        id="ws-channel-select"
        value={channel}
        onChange={(event) => setChannel(event.target.value as Channel)}
        className="w-full rounded-xl border border-line bg-canvas px-3 py-2 text-sm"
      >
        {CHANNELS.map((value) => (
          <option key={value} value={value}>
            {value}
          </option>
        ))}
      </select>

      <ul className="space-y-2">
        {messages.length === 0 ? (
          <li className="rounded-xl border border-line bg-canvas px-3 py-2 text-sm text-muted">
            Waiting for events...
          </li>
        ) : null}
        {messages.map((message, index) => (
          <li key={`${message.timestamp}-${index}`} className="rounded-xl border border-line bg-canvas px-3 py-2 text-xs">
            <div className="font-medium uppercase tracking-[0.12em] text-muted">
              {message.type} / {message.channel}
            </div>
            <pre className="mt-1 overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-ink">
              {JSON.stringify(message.data, null, 2)}
            </pre>
          </li>
        ))}
      </ul>
    </article>
  );
}
