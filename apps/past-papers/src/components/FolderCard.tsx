import { Link } from "react-router-dom";
import { ArrowRight, Folder } from "lucide-react";

interface FolderCardProps {
  to: string;
  title: string;
  subtitle?: string;
  accent?: "primary" | "accent" | "success";
}

const ACCENTS: Record<NonNullable<FolderCardProps["accent"]>, string> = {
  primary: "--primary",
  accent: "--accent",
  success: "--success",
};

export default function FolderCard({
  to,
  title,
  subtitle,
  accent = "primary",
}: FolderCardProps) {
  const accentVar = ACCENTS[accent];
  const accentColor = `hsl(var(${accentVar}))`;
  const accentBg = `hsl(var(${accentVar}) / 0.08)`;
  const accentBorder = `hsl(var(${accentVar}) / 0.2)`;

  return (
    <Link
      to={to}
      className="group flex flex-col bg-card rounded-2xl p-5 border border-border transition-all duration-200 hover:-translate-y-1"
      style={{ boxShadow: "var(--shadow-card)" }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-hover)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.boxShadow = "var(--shadow-card)")
      }
    >
      <div
        className="w-11 h-11 flex items-center justify-center rounded-xl mb-4"
        style={{ background: accentBg, border: `1px solid ${accentBorder}` }}
      >
        <Folder size={20} style={{ color: accentColor }} />
      </div>

      <h3 className="font-display font-bold text-base text-foreground mb-1">
        {title}
      </h3>
      {subtitle && (
        <p className="text-xs text-muted-foreground mb-3">{subtitle}</p>
      )}

      <span
        className="mt-auto inline-flex items-center gap-1 text-sm font-semibold transition-colors"
        style={{ color: accentColor }}
      >
        Open
        <ArrowRight
          size={14}
          className="transition-transform group-hover:translate-x-0.5"
        />
      </span>
    </Link>
  );
}
