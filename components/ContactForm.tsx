"use client";

import { useState } from "react";
import { Check, Copy, Send } from "lucide-react";

const EMAIL = "vsachde74@gmail.com";
const intents = ["A project", "A role", "Collab", "Just hi"];

// Composes a pre-filled email in the visitor's mail app; no backend involved.
export default function ContactForm() {
  const [intent, setIntent] = useState(intents[0]);
  const [name, setName] = useState("");
  const [from, setFrom] = useState("");
  const [message, setMessage] = useState("");
  const [copied, setCopied] = useState(false);

  const send = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = `${intent} — from ${name || "your portfolio"}`;
    const body = `${message}\n\n—\n${name}${from ? `\n${from}` : ""}`;
    window.location.href = `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {}
  };

  const field = "w-full bg-transparent py-3.5 text-[16px] outline-none placeholder:text-muted/70";

  return (
    <form onSubmit={send}>
      <div className="text-[13px] font-medium text-muted">I&apos;m reaching out about</div>
      <div className="mt-2.5 flex flex-wrap gap-2">
        {intents.map((i) => (
          <button
            key={i}
            type="button"
            onClick={() => setIntent(i)}
            className={`rounded-full px-3.5 py-2 text-[14px] font-medium transition-all active:scale-95 ${
              intent === i ? "bg-blue text-white" : "bg-fill text-ink"
            }`}
          >
            {i}
          </button>
        ))}
      </div>

      <div className="mt-5 rounded-[22px] bg-fill px-4">
        <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" autoComplete="name" className={`${field} border-b border-line`} />
        <input type="email" value={from} onChange={(e) => setFrom(e.target.value)} placeholder="Your email (optional)" autoComplete="email" className={`${field} border-b border-line`} />
        <textarea
          required
          rows={4}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={intent === "Just hi" ? "Say hi…" : "What are you building?"}
          className={`${field} resize-none`}
        />
      </div>

      <div className="mt-4 flex items-center gap-3">
        <button
          type="submit"
          className="flex flex-1 items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-[15px] font-semibold text-white transition-transform active:scale-[0.98]"
        >
          <Send className="size-4" strokeWidth={2.25} />
          Send via email
        </button>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy email address"
          className="grid size-[50px] shrink-0 place-items-center rounded-full bg-fill transition-transform active:scale-95"
        >
          {copied ? <Check className="size-[18px] text-green-deep" strokeWidth={2.5} /> : <Copy className="size-[18px]" strokeWidth={2} />}
        </button>
      </div>
      <p className="mt-2.5 h-4 text-center text-[12px] text-muted">{copied ? "Email copied" : "Opens your mail app with everything filled in."}</p>
    </form>
  );
}
