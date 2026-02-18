import React, { useState } from "react";
import { BadgePill, PremiumButton, PremiumCard, SectionShell } from "../components";

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const StandrWaitlistSection = () => {
  const [form, setForm] = useState({ email: "", twitter: "" });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const onChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    if (!emailRegex.test(form.email.trim())) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitted(true);
  };

  return (
    <SectionShell id="standr" tone="elevated" className="py-10">
      <div className="section-shell__inner">
        <PremiumCard tone="surface-2" className="p-6 md:p-10">
          <div className="grid gap-8 md:grid-cols-[1.2fr_1fr] md:items-start">
            <div>
              <BadgePill>STANDR DEX WAITLIST</BadgePill>
              <h2 className="mt-4 text-3xl font-semibold md:text-4xl">Join STANDR DEX early access</h2>
              <p className="mt-3 text-secondary">
                STANDR DEX is EOSI Finance's upcoming DeFAI execution layer. Join the waitlist to receive launch updates,
                rollout milestones, and early access notices.
              </p>
              <p className="mt-3 text-sm text-muted">
                Current status: coming soon. Initial rollout prioritizes risk controls, transparency, and staged release quality.
              </p>
            </div>

            <form onSubmit={onSubmit} className="surface-1 rounded-premium p-5">
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

              {error ? <p className="mt-3 text-xs text-[#ff8f8f]">{error}</p> : null}
              {submitted ? <p className="mt-3 text-xs text-[#8be39f]">You're on the STANDR waitlist. We'll keep you updated.</p> : null}

              <div className="mt-5">
                <PremiumButton as="button" type="submit" variant="brand" size="sm" className="w-full">
                  Join the waitlist
                </PremiumButton>
              </div>
            </form>
          </div>
        </PremiumCard>
      </div>
    </SectionShell>
  );
};

export default StandrWaitlistSection;
