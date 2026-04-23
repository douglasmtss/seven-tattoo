interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  accent?: boolean;
}

export default function StatsCard({
  title,
  value,
  subtitle,
  icon,
  accent = false,
}: StatsCardProps) {
  return (
    <div
      className={`p-6 rounded border ${accent ? "border-[var(--gold)] bg-[var(--gold)]/5" : "border-[var(--border)] bg-[var(--surface)]"}`}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className={`${accent ? "text-[var(--gold)]" : "text-[var(--text-muted)]"}`}
        >
          {icon}
        </div>
      </div>
      <div className={`text-3xl font-bold mb-1 ${accent ? "text-[var(--gold)]" : "text-[var(--foreground)]"}`}>
        {value}
      </div>
      <div className="text-xs tracking-widest uppercase text-[var(--text-muted)]">
        {title}
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-[var(--text-muted)]">{subtitle}</div>
      )}
    </div>
  );
}
