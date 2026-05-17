import Layout from "@/components/Layout";
import FolderCard from "@/components/FolderCard";
import { LoadingGrid, ErrorState, EmptyState } from "@/components/StateViews";
import { useAsync } from "@/hooks/useAsync";
import { listSubjects } from "@/lib/papers";

const ACCENT_CYCLE = ["primary", "accent", "success"] as const;

export default function SubjectsPage() {
  const { data, loading, error } = useAsync(() => listSubjects(), []);

  return (
    <Layout subtitle="Browse topical papers and mark schemes by subject, component, and chapter.">
      <h2 className="font-display font-bold text-2xl text-foreground mb-6">
        Subjects
      </h2>

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
