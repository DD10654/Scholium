import { useParams } from "react-router-dom";
import { Download, FileText, ScrollText } from "lucide-react";
import Layout from "@/components/Layout";
import Crumbs from "@/components/Crumbs";
import { ErrorState, EmptyState } from "@/components/StateViews";
import { useAsync } from "@/hooks/useAsync";
import { listChapters, subjectDisplayName, type ChapterEntry, type PaperFile } from "@/lib/papers";

function PaperLink({
  file,
  variant,
}: {
  file: PaperFile | null;
  variant: "qp" | "ms";
}) {
  const label = variant === "qp" ? "Question paper" : "Mark scheme";
  const Icon = variant === "qp" ? FileText : ScrollText;
  const accentVar = variant === "qp" ? "--primary" : "--accent";
  const color = `hsl(var(${accentVar}))`;
  const bg = `hsl(var(${accentVar}) / 0.08)`;
  const border = `hsl(var(${accentVar}) / 0.2)`;

  if (!file) {
    return (
      <div
        className="flex items-center gap-3 rounded-xl border border-dashed border-border px-4 py-3 text-sm text-muted-foreground"
        aria-label={`${label} not available`}
      >
        <Icon size={16} className="opacity-50" />
        <span>{label} not available</span>
      </div>
    );
  }

  return (
    <a
      href={file.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center gap-3 rounded-xl border px-4 py-3 text-sm font-medium transition-colors hover:opacity-90"
      style={{ background: bg, borderColor: border, color }}
    >
      <Icon size={16} />
      <span className="flex-1">{label}</span>
      <Download
        size={14}
        className="opacity-60 group-hover:opacity-100 transition-opacity"
      />
    </a>
  );
}

function ChapterCard({ entry }: { entry: ChapterEntry }) {
  return (
    <article
      className="rounded-2xl border border-border bg-card p-5"
      style={{ boxShadow: "var(--shadow-card)" }}
    >
      <div className="flex items-baseline gap-3 mb-4">
        <span
          className="font-display font-bold text-sm w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
          style={{
            background: "hsl(var(--primary) / 0.1)",
            color: "hsl(var(--primary))",
          }}
        >
          {entry.number}
        </span>
        <h3 className="font-display font-bold text-lg text-foreground leading-tight">
          {entry.name}
        </h3>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <PaperLink file={entry.questionPaper} variant="qp" />
        <PaperLink file={entry.markScheme} variant="ms" />
      </div>
    </article>
  );
}

export default function ChaptersPage() {
  const { subject = "", component = "" } = useParams();
  const subjectName = decodeURIComponent(subject);
  const componentName = decodeURIComponent(component);

  const { data, loading, error } = useAsync(
    () => listChapters(subjectName, componentName),
    [subjectName, componentName]
  );

  return (
    <Layout subtitle="Each chapter has a paper compilation and its mark scheme.">
      <div className="mb-4">
        <Crumbs
          items={[
            { label: "Subjects", to: "/" },
            { label: subjectDisplayName(subjectName), to: `/${encodeURIComponent(subjectName)}` },
            { label: componentName },
          ]}
        />
      </div>

      <div className="mb-6">
        <h2 className="font-display font-bold text-2xl text-foreground">
          {componentName}
        </h2>
        <p className="text-sm text-muted-foreground mt-1">{subjectDisplayName(subjectName)}</p>
      </div>

      {loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-2xl border border-border bg-card animate-pulse"
            />
          ))}
        </div>
      )}
      {error && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          title="No chapters yet"
          hint={`Upload PDFs named like "3-Algebra-QP.pdf" and "3-Algebra-MS.pdf" into "${subjectName}/${componentName}".`}
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {data.map((entry) => (
            <ChapterCard key={entry.number} entry={entry} />
          ))}
        </div>
      )}
    </Layout>
  );
}
