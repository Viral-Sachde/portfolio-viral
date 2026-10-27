import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, ChevronLeft, Lock } from "lucide-react";
import PhonePreview from "@/components/PhonePreview";
import ScrollBlur from "@/components/ScrollBlur";
import { projects } from "@/lib/content";

export const metadata: Metadata = { title: "Projects" };

export default function ProjectsPage() {
  return (
    <main id="main" className="mx-auto max-w-[640px] px-6 pb-24 pt-10">
      <Link href="/" className="-ml-1 inline-flex items-center gap-0.5 text-[15px] font-medium text-link">
        <ChevronLeft className="size-5" strokeWidth={2.25} />
        Viral Sachde
      </Link>
      <h1 className="rise mt-10 text-[44px] font-semibold leading-none tracking-[-0.04em]">Projects</h1>
      <p className="rise mt-3 text-[15px] text-muted">Things I built end to end, with AI where it earns its place.</p>

      <ul className="mt-12 space-y-14">
        {projects.map((p, i) => (
          <li key={p.slug} className={`rise flex items-center gap-4 ${i % 2 ? "flex-row-reverse" : ""}`}>
            <div className="w-[47%] shrink-0 sm:w-[220px]">
              <PhonePreview preview={p.preview} title={p.title} />
            </div>
            <div className="min-w-0">
              <span className="text-[12px] font-medium text-muted">{p.platforms}</span>
              <h2 className="mt-1 text-[22px] font-semibold leading-tight tracking-[-0.03em]">{p.title}</h2>
              <p className="mt-2 text-[14px] leading-snug text-ink/75">{p.description}</p>
              <p className="mt-2.5 text-[12px] text-muted">{p.stack}</p>
              {p.href ? (
                <a
                  href={p.href}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1 rounded-full bg-ink px-3.5 py-2 text-[13px] font-medium text-paper transition-transform active:scale-95"
                >
                  Open
                  <span className="sr-only"> {p.title} (opens in new tab)</span>
                  <ArrowUpRight className="size-3.5" strokeWidth={2.5} />
                </a>
              ) : (
                <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-fill px-3.5 py-2 text-[13px] font-medium text-muted">
                  <Lock className="size-3" strokeWidth={2.5} />
                  Private
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <ScrollBlur />
    </main>
  );
}
