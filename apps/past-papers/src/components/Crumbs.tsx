import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

export interface Crumb {
  label: string;
  to?: string;
}

export default function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-1">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={i} className="flex items-center gap-1">
              {item.to && !last ? (
                <Link
                  to={item.to}
                  className="hover:text-foreground transition-colors"
                >
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-foreground font-medium" : ""}>
                  {item.label}
                </span>
              )}
              {!last && <ChevronRight size={14} className="opacity-60" />}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
