import type { Metadata } from "next";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import Cover from "@/components/Cover";
import ScrollBlur from "@/components/ScrollBlur";
import { articles, readingMinutes } from "@/lib/articles";

export const metadata: Metadata = { title: "Writing" };

export default function WritingPage() {
  return (
    <main className="mx-auto max-w-[640px] px-6 pb-24 pt-10">
      <Link href="/" className="-ml-1 inline-flex items-center gap-0.5 text-[15px] font-medium text-blue">
        <ChevronLeft className="size-5" strokeWidth={2.25} />
        Viral Sachde
      </Link>
      <h1 className="rise mt-10 text-[44px] font-semibold leading-none tracking-[-0.04em]">Writing</h1>
      <p className="rise mt-3 text-[15px] text-muted">Notes on building software people actually use.</p>

      <ul className="mt-10 space-y-3">
        {articles.map((a) => (
          <li key={a.slug} className="rise">
            <Link
              href={`/writing/${a.slug}`}
              className="flex items-center gap-4 rounded-[22px] bg-fill p-3 pr-4 transition-transform active:scale-[0.98]"
            >
              <Cover seed={a.seed} className="size-[72px] shrink-0 rounded-[14px]" />
              <div className="min-w-0">
                <h2 className="text-[17px] font-semibold leading-tight tracking-[-0.02em]">{a.title}</h2>
                <p className="mt-1 line-clamp-2 text-[14px] leading-snug text-muted">{a.dek}</p>
                <span className="mt-1.5 block text-[12px] font-medium text-muted">{readingMinutes(a)} min read</span>
              </div>
            </Link>
          </li>
        ))}
      </ul>
      <ScrollBlur />
    </main>
  );
}
