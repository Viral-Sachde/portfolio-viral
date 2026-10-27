import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronLeft } from "lucide-react";
import Cover from "@/components/Cover";
import ScrollBlur from "@/components/ScrollBlur";
import { articles, getArticle, readingMinutes } from "@/lib/articles";

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const article = getArticle((await params).slug);
  return article ? { title: article.title, description: article.dek } : {};
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const article = getArticle((await params).slug);
  if (!article) notFound();

  const index = articles.indexOf(article);
  const next = articles[(index + 1) % articles.length];

  return (
    <main id="main" className="mx-auto max-w-[640px] px-6 pb-24 pt-10">
      <Link href="/writing" className="-ml-1 inline-flex items-center gap-0.5 text-[15px] font-medium text-link">
        <ChevronLeft className="size-5" strokeWidth={2.25} />
        Writing
      </Link>

      <article className="mt-10">
        <header className="rise">
          <span className="text-[13px] font-medium text-muted">{readingMinutes(article)} min read</span>
          <h1 className="mt-2 text-[38px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[52px]">
            {article.title}
          </h1>
          <p className="mt-4 text-[19px] leading-snug tracking-tight text-muted">{article.dek}</p>
        </header>

        <Cover seed={article.seed} className="rise mt-8 aspect-[16/9] w-full rounded-[24px]" />

        <div className="mt-10 space-y-6 text-[17px] leading-[1.7] text-ink/85">
          {article.body.map((block) =>
            block.startsWith("## ") ? (
              <h2 key={block} className="pt-4 text-[22px] font-semibold tracking-[-0.03em] text-ink">
                {block.slice(3)}
              </h2>
            ) : (
              <p key={block}>{block}</p>
            )
          )}
        </div>
      </article>

      <Link
        href={`/writing/${next.slug}`}
        className="group mt-16 flex items-center justify-between gap-4 rounded-[22px] bg-fill p-5 transition-transform active:scale-[0.98]"
      >
        <div>
          <span className="text-[12px] font-medium text-muted">Next</span>
          <div className="mt-0.5 text-[17px] font-semibold tracking-[-0.02em]">{next.title}</div>
        </div>
        <ArrowRight className="size-5 shrink-0 text-link transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
      </Link>
      <ScrollBlur />
    </main>
  );
}
