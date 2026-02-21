import React, { useState } from "react";
import { BadgePill, PremiumButton, PremiumCard, SectionShell } from "../components";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const PropFirmWaitlistSection = () => {
  const [form, setForm] = useState({ email: "", twitter: "", website: "" });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/waitlist/propfirm", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email.trim(), twitter: form.twitter.trim(), website: form.website }),
      });
      if (res.ok) {
        setSubmitted(true);
      } else {
        const data = await res.json().catch(() => ({}));
        setError(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SectionShell id="propfirm" tone="muted" className="py-10">
      <div className="section-shell__inner">
        <PremiumCard tone="surface-1" className="p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <BadgePill>PROP FIRM WAITLIST</BadgePill>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Join the funded account waitlist</h2>
              <p className="mt-3 text-secondary">
                EOSI Finance is preparing a Web3-native prop firm path for traders who want structured evaluation and performance-based growth.
                Join the waitlist to receive launch access and qualification updates.
              </p>
              <p className="mt-3 text-sm text-muted">
                Current status: coming soon. We are finalizing the evaluation flow, onboarding policy, and risk framework.
              </p>
            </div>

            <form onSubmit={onSubmit} className="surface-2 rounded-premium p-5">
              <p className="text-xs uppercase tracking-[0.14em] text-muted">Waitlist form</p>

              <label className="mt-4 block text-xs text-secondary">Email *</label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={onChange}
                placeholder="you@example.com"
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f1422] px-3 py-2 text-sm text-primary outline-none"
              />

              <label className="mt-4 block text-xs text-secondary">Twitter / X (optional)</label>
              <input
                type="text"
                name="twitter"
                value={form.twitter}
                onChange={onChange}
                placeholder="@yourhandle"
                className="mt-2 w-full rounded-lg border border-white/10 bg-[#0f1422] px-3 py-2 text-sm text-primary outline-none"
              />

              <input
                type="text"
                name="website"
                value={form.website || ""}
                onChange={onChange}
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
                style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }}
              />
              {error ? <p className="mt-3 text-xs text-[#ff8f8f]">{error}</p> : null}
              {submitted ? <p className="mt-3 text-xs text-[#8be39f]">You're on the Prop Firm waitlist. We'll notify you.</p> : null}

              <div className="mt-5">
                <PremiumButton as="button" type="submit" variant="brand" size="sm" className="w-full" disabled={submitting || submitted}>
                  {submitting ? "Submitting…" : submitted ? "You're on the list!" : "Join the waitlist"}
                </PremiumButton>
              </div>
            </form>
          </div>
        </PremiumCard>
      </div>
    </SectionShell>
  );
};

export default PropFirmWaitlistSection;
