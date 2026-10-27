import { ArrowUpRight, Lock } from "lucide-react";
import type { Project } from "@/lib/content";
import PhonePreview from "./PhonePreview";

// A phone preview with its caption; links out when the project is public.
export default function ProjectPhone({ project, className = "" }: { project: Project; className?: string }) {
  const body = (
    <>
      <div className="transition-transform duration-500 ease-[cubic-bezier(0.2,0.8,0.2,1)] group-hover:-translate-y-1.5 group-active:scale-[0.98]">
        <PhonePreview preview={project.preview} title={project.title} />
      </div>
      <div className="mt-3.5 flex items-start justify-between gap-2 px-1">
        <div>
          <h3 className="text-[16px] font-semibold leading-tight tracking-[-0.02em]">{project.title}</h3>
          <p className="mt-0.5 text-[12px] text-muted">{project.platforms}</p>
          {project.href && <span className="sr-only">(opens in new tab)</span>}
        </div>
        {project.href ? (
          <ArrowUpRight className="size-4 shrink-0 text-muted transition-colors group-hover:text-link" strokeWidth={2.25} />
        ) : (
          <Lock className="size-3.5 shrink-0 text-muted" strokeWidth={2.25} />
        )}
      </div>
    </>
  );

  return project.href ? (
    <a href={project.href} target="_blank" rel="noreferrer" className={`group block ${className}`}>
      {body}
    </a>
  ) : (
    <div className={`group ${className}`}>{body}</div>
  );
}
