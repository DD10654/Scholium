import { useParams } from "react-router-dom";
import Layout from "@/components/Layout";
import FolderCard from "@/components/FolderCard";
import Crumbs from "@/components/Crumbs";
import { LoadingGrid, ErrorState, EmptyState } from "@/components/StateViews";
import { useAsync } from "@/hooks/useAsync";
import { listComponents, subjectDisplayName } from "@/lib/papers";

const ACCENT_CYCLE = ["primary", "accent", "success"] as const;

export default function ComponentsPage() {
  const { subject = "" } = useParams();
  const subjectName = decodeURIComponent(subject);

  const { data, loading, error } = useAsync(
    () => listComponents(subjectName),
    [subjectName]
  );

  return (
    <Layout subtitle="Pick a paper component to see its chapter-wise compilations.">
      <div className="mb-4">
        <Crumbs
          items={[
            { label: "Subjects", to: "/" },
            { label: subjectDisplayName(subjectName) },
          ]}
        />
      </div>

      <h2 className="font-display font-bold text-2xl text-foreground mb-6">
        {subjectDisplayName(subjectName)}
      </h2>

      {loading && <LoadingGrid count={4} />}
      {error && <ErrorState error={error} />}
      {!loading && !error && data && data.length === 0 && (
        <EmptyState
          title="No components yet"
          hint={`Add a folder under "${subjectName}" in the papers bucket to see it here.`}
        />
      )}
      {!loading && !error && data && data.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {data.map((component, i) => (
            <FolderCard
              key={component}
              to={`/${encodeURIComponent(subjectName)}/${encodeURIComponent(component)}`}
              title={component}
              subtitle="Compilation by chapter"
              accent={ACCENT_CYCLE[i % ACCENT_CYCLE.length]}
            />
          ))}
        </div>
      )}
    </Layout>
  );
}
