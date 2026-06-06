import { useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import Layout from "@/components/Layout";
import FolderCard from "@/components/FolderCard";
import { LoadingGrid, ErrorState, EmptyState } from "@/components/StateViews";
import { useAsync } from "@/hooks/useAsync";
import { listSubjects } from "@/lib/papers";

const ACCENT_CYCLE = ["primary", "accent", "success"] as const;

interface SubjectsPageProps {
  description?: string | null;
}

export default function SubjectsPage({ description }: SubjectsPageProps = {}) {
  const navigate = useNavigate();
  const { data, loading, error } = useAsync(() => listSubjects(), []);

  return (
    <Layout subtitle={description ?? "Topical IGCSE practice papers and mark schemes, organised by subject, component, and chapter."}>
      <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 mb-10">
        <div>
          <span className="rui-eyebrow block mb-2">Section 01 · Index</span>
          <h2
            className="text-foreground"
            style={{
              fontSize: "clamp(1.75rem, 4vw, 2.5rem)",
              fontWeight: 700,
              letterSpacing: "-0.02em",
              lineHeight: 1.05,
            }}
          >
            Subjects <span style={{ color: "hsl(var(--primary))" }}>at hand.</span>
          </h2>
        </div>
        <button
          onClick={() => navigate("/generate")}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-[var(--radius-sm)] text-sm font-bold transition-all hover:-translate-y-0.5"
          style={{
            background: "hsl(var(--primary))",
            color: "hsl(var(--primary-foreground))",
            boxShadow: "var(--shadow-soft)",
          }}
        >
          <Zap size={14} />
          Generate Paper
        </button>
      </div>

      {loading && <LoadingGrid />}
      {error && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          title="No subjects yet"
          hint="Once subjects are added to the papers bucket, they'll appear here."
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((subject, i) => (
            <FolderCard
              key={subject}
              to={`/${encodeURIComponent(subject)}`}
              title={subject}
              accent={ACCENT_CYCLE[i % ACCENT_CYCLE.length]}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
