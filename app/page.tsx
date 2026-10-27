import Link from "next/link";
import { ArrowDown, ArrowRight, ChevronRight, FileText, Mail, Plus, Wrench } from "lucide-react";
import Board from "@/components/Board";
import { GithubIcon, LinkedinIcon, XIcon } from "@/components/BrandIcons";
import Clock from "@/components/Clock";
import ConsoleHello from "@/components/ConsoleHello";
import ContactForm from "@/components/ContactForm";
import Cover from "@/components/Cover";
import InView from "@/components/InView";
import Mosaic, { CORNER, EDGE, GROUND } from "@/components/Mosaic";
import ProjectPhone from "@/components/ProjectPhone";
import ScrollBlur from "@/components/ScrollBlur";
import StackPicker from "@/components/StackPicker";
import { articles, readingMinutes } from "@/lib/articles";
import { experience, projects } from "@/lib/content";

const links = [
  { label: "Email", detail: "vsachde74@gmail.com", href: "mailto:vsachde74@gmail.com", icon: Mail, tint: "bg-blue" },
  { label: "GitHub", detail: "Viral-Sachde", href: "https://github.com/Viral-Sachde", icon: GithubIcon, tint: "bg-ink" },
  { label: "LinkedIn", detail: "viral-sachde", href: "https://in.linkedin.com/in/viral-sachde-18664b24b", icon: LinkedinIcon, tint: "bg-blue-deep" },
  { label: "X", detail: "@viralpullls", href: "https://x.com/viralpullls", icon: XIcon, tint: "bg-ink" },
  { label: "Résumé", detail: "Download PDF", href: "/resume.pdf", icon: FileText, tint: "bg-green", download: true },
];

function Section({ id, label, wide, children }: { id?: string; label: string; wide?: boolean; children: React.ReactNode }) {
  return (
    <InView as="section" className={`reveal mx-auto scroll-mt-6 px-6 py-12 sm:py-16 ${wide ? "max-w-[880px]" : "max-w-[640px]"}`}>
      {id && <span id={id} className="relative -top-6 block" />}
      <h2 className="mb-5 flex items-center gap-2 text-[13px] font-medium text-muted">
        <span className="size-1.5 rounded-[1px] bg-blue" />
        {label}
      </h2>
      {children}
    </InView>
  );
}

function Widget({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <div className={`flex h-[104px] flex-col justify-between rounded-[18px] p-3.5 transition-transform active:scale-[0.97] ${className}`}>
      {children}
    </div>
  );
}

export default function Home() {
  return (
    <main className="overflow-x-clip">
      <header className="relative isolate flex min-h-[88svh] flex-col items-center justify-center px-6 pb-28 pt-28 text-center">
        <Mosaic map={CORNER} className="absolute left-0 top-0 -z-10 w-[34vw] max-w-[260px]" />
        <Mosaic map={EDGE} className="absolute right-0 top-[11%] -z-10 w-[13vw] max-w-[140px] sm:top-[22%] sm:w-[11vw]" />
        <Mosaic map={GROUND} className="absolute bottom-0 left-1/2 -z-10 w-[78vw] max-w-[560px] -translate-x-1/2" />

        <h1 className="rise text-[44px] font-semibold leading-none tracking-[-0.04em] sm:text-[80px]">Viral Sachde</h1>
        <p className="rise mt-4 text-[17px] font-medium tracking-tight sm:text-[21px]">
          Forward Deployed / Solutions Engineer
        </p>
        <div className="rise mt-2 max-w-[32ch] space-y-1 text-balance text-[15px] leading-snug text-muted">
          <p>Full Stack + AI · Ahmedabad</p>
          <p>Currently running on curiosity and 47 open tabs.</p>
        </div>
        <div className="rise mt-7 flex items-center gap-2.5">
          <a
            href="/resume.pdf"
            download="Viral-Sachde-Resume.pdf"
            className="flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition-transform active:scale-95"
          >
            <ArrowDown className="size-4" strokeWidth={2.25} />
            Résumé
          </a>
          <a
            href="#contact"
            className="rounded-full bg-fill px-4 py-2.5 text-[14px] font-medium transition-transform active:scale-95"
          >
            Say hello
          </a>
        </div>
      </header>

      <Section label="Experience">
        <ul>
          {experience.map(({ company, role, dates, now, groups }) => (
            <li key={company} className="border-t border-line">
              <details>
                <summary className="flex cursor-pointer items-start justify-between gap-4 py-4">
                  <div>
                    <div className="flex items-center gap-2 font-semibold tracking-tight">
                      {company}
                      {now && (
                        <span className="rounded-full bg-green/15 px-2 py-0.5 text-[11px] font-semibold text-green-deep">
                          Now
                        </span>
                      )}
                    </div>
                    <div className="mt-0.5 text-[14px] text-muted">
                      {role} · {dates}
                    </div>
                  </div>
                  <Plus className="chev mt-1 size-4 shrink-0 text-muted transition-transform duration-300" strokeWidth={2.25} />
                </summary>
                <div className="space-y-4 pb-5">
                  {groups.map((g, i) => (
                    <div key={i}>
                      {"title" in g && <div className="mb-1.5 text-[14px] font-medium">{g.title}</div>}
                      <ul className="space-y-1.5">
                        {g.points.map((p) => (
                          <li key={p} className="flex gap-2.5 text-[14px] leading-relaxed text-ink/75">
                            <span className="mt-[9px] size-1 shrink-0 rounded-[1px] bg-blue" />
                            {p}
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </details>
            </li>
          ))}
        </ul>
      </Section>

      <Section label="How I work">
        <ol className="space-y-3">
          <li className="rounded-[24px] bg-fill p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-[9px] bg-blue text-[15px] font-semibold text-white">?</span>
              <h3 className="text-[19px] font-semibold tracking-[-0.03em]">Curious first</h3>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink/75">
              I ask why it works the way it does, then I read the source. Understanding the system beats guessing at it.
            </p>
          </li>
          <li className="rounded-[24px] bg-fill p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-[9px] bg-green text-white">
                <ArrowRight className="size-4 -rotate-45" strokeWidth={2.5} />
              </span>
              <h3 className="text-[19px] font-semibold tracking-[-0.03em]">Ship, then iterate</h3>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink/75">
              Production is a feedback loop, not a finish line. v1 goes live; the next versions are what real users teach me.
            </p>
            <div className="mt-3.5 flex items-center gap-1.5 text-[12px] font-semibold">
              {["v1", "v2", "v3"].map((v, i) => (
                <span key={v} className="flex items-center gap-1.5">
                  <span className={`rounded-full px-2.5 py-1 ${i === 2 ? "bg-green text-white" : "bg-white text-muted"}`}>{v}</span>
                  {i < 2 && <span className="h-px w-4 bg-line" />}
                </span>
              ))}
              <span className="ml-1 text-muted">…</span>
            </div>
          </li>
          <li className="rounded-[24px] bg-fill p-5">
            <div className="flex items-center gap-2.5">
              <span className="grid size-8 place-items-center rounded-[9px] bg-yellow">
                <Wrench className="size-4 text-ink" strokeWidth={2.25} />
              </span>
              <h3 className="text-[19px] font-semibold tracking-[-0.03em]">Built to be maintained</h3>
            </div>
            <p className="mt-2.5 text-[15px] leading-relaxed text-ink/75">
              Code the next person can change at 2 a.m. Clear boundaries, boring infrastructure, audit trails and tests
              where they matter.
            </p>
          </li>
        </ol>
      </Section>

      <Section label="Projects">
        <p className="mb-7 max-w-[22ch] text-[28px] font-semibold leading-[1.05] tracking-[-0.04em] sm:text-[40px]">
          Things I built end to end, AI included.
        </p>
        <div className="rail -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-4 overflow-x-auto px-6 pb-3 pt-2">
          {projects.slice(0, 4).map((p) => (
            <ProjectPhone key={p.slug} project={p} className="w-[56%] shrink-0 snap-start sm:w-[30%]" />
          ))}
        </div>
        <Link
          href="/projects"
          className="group mt-6 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition-transform active:scale-95"
        >
          All projects
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
        </Link>
      </Section>

      <Section label="Stack">
        <StackPicker />
      </Section>

      <Section label="At a glance">
        <div className="grid grid-cols-2 gap-2.5">
          <Widget className="bg-blue text-white">
            <span className="text-[12px] font-medium opacity-80">Ahmedabad</span>
            <div>
              <div className="text-[28px] font-semibold leading-none tracking-[-0.04em]">
                <Clock />
              </div>
              <span className="text-[11px] opacity-80">IST · UTC+5:30</span>
            </div>
          </Widget>
          <Widget className="bg-green text-white">
            <span className="text-[12px] font-medium opacity-80">Shipping</span>
            <div>
              <div className="text-[28px] font-semibold leading-none tracking-[-0.04em]">2+ yrs</div>
              <span className="text-[11px] opacity-80">production software</span>
            </div>
          </Widget>
          <Widget className="bg-yellow text-ink">
            <span className="text-[12px] font-medium opacity-70">End to end</span>
            <div>
              <div className="text-[28px] font-semibold leading-none tracking-[-0.04em]">10+</div>
              <span className="text-[11px] opacity-75">products shipped</span>
            </div>
          </Widget>
          <Widget className="bg-blue-deep text-white">
            <span className="text-[12px] font-medium opacity-80">Platforms</span>
            <div>
              <div className="text-[28px] font-semibold leading-none tracking-[-0.04em]">3</div>
              <span className="text-[11px] opacity-80">web, iOS and Android</span>
            </div>
          </Widget>
          <div className="col-span-2 flex items-center justify-between rounded-[18px] bg-fill px-3.5 py-3">
            <span className="text-[12px] font-medium text-muted">Shipped for</span>
            <span className="text-[15px] font-semibold tracking-[-0.02em]">Vodafone · M&amp;G · more</span>
          </div>
        </div>
      </Section>

      <Section label="Writing">
        <div className="rail -mx-6 flex snap-x snap-mandatory scroll-px-6 gap-3 overflow-x-auto px-6 pb-2">
          {articles.slice(0, 3).map((a) => (
            <Link
              key={a.slug}
              href={`/writing/${a.slug}`}
              className="flex w-[78%] shrink-0 snap-start flex-col overflow-hidden rounded-[24px] bg-fill transition-transform active:scale-[0.98] sm:w-[46%]"
            >
              <Cover seed={a.seed} className="aspect-[16/9] w-full" />
              <div className="flex flex-1 flex-col p-4">
                <h3 className="text-[19px] font-semibold leading-tight tracking-[-0.02em]">{a.title}</h3>
                <p className="mt-1.5 flex-1 text-[14px] leading-snug text-muted">{a.dek}</p>
                <span className="mt-4 text-[12px] font-medium text-muted">{readingMinutes(a)} min read</span>
              </div>
            </Link>
          ))}
        </div>
        <Link
          href="/writing"
          className="group mt-5 inline-flex items-center gap-1.5 rounded-full bg-ink px-4 py-2.5 text-[14px] font-medium text-white transition-transform active:scale-95"
        >
          Read more
          <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" strokeWidth={2.25} />
        </Link>
      </Section>

      <Section label="Play" wide>
        <p className="max-w-[14ch] text-[32px] font-semibold leading-[1.02] tracking-[-0.04em] sm:text-[48px]">
          Small pieces, in the right places.
        </p>
        <div className="mt-8">
          <Board />
        </div>
      </Section>

      <Section id="contact" label="Contact">
        <p className="text-[36px] font-semibold leading-none tracking-[-0.04em] sm:text-[48px]">Say hello.</p>
        <p className="mt-3 text-[15px] text-muted">Tell me what you&apos;re building.</p>
        <div className="mt-7">
          <ContactForm />
        </div>

        <ul className="mt-8 overflow-hidden rounded-[22px] bg-fill">
          {links.map(({ label, detail, href, icon: Icon, tint, download }) => (
            <li key={label} className="group/row">
              <a
                href={href}
                target={href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                download={download ? "Viral-Sachde-Resume.pdf" : undefined}
                className="flex items-center gap-3.5 pl-4 transition-colors active:bg-line/70 sm:hover:bg-line/50"
              >
                <span className={`grid size-[30px] shrink-0 place-items-center rounded-[8px] ${tint}`}>
                  <Icon className="size-[17px] text-white" strokeWidth={2} />
                </span>
                <span className="flex min-w-0 flex-1 items-center gap-3 border-b border-line py-3.5 pr-4 group-last/row:border-0">
                  <span className="flex-1 text-[16px]">{label}</span>
                  <span className="truncate text-[15px] text-muted">{detail}</span>
                  <ChevronRight className="size-4 shrink-0 text-muted/60" strokeWidth={2.5} />
                </span>
              </a>
            </li>
          ))}
        </ul>
      </Section>

      <footer className="px-6 pb-16 pt-10 text-center text-[13px] text-muted">
        © {new Date().getFullYear()} Viral Sachde
      </footer>

      <ScrollBlur />
      <ConsoleHello />
    </main>
  );
}
