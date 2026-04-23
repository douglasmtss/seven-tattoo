"use client";

import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { AnalyticsEvent } from "@/types";
import { getLast7Days, groupByDate } from "@/lib/utils";

interface AnalyticsDashboardProps {
  events: AnalyticsEvent[];
}

export default function AnalyticsDashboard({ events }: AnalyticsDashboardProps) {
  const last7Days = getLast7Days();

  const pageviews = events.filter((e) => e.type === "pageview");
  const contacts = events.filter((e) => e.type === "contact_form");
  const appointments = events.filter((e) => e.type === "appointment_request");
  const whatsapp = events.filter((e) => e.type === "whatsapp_click");

  const pvByDay = groupByDate(pageviews.map(e => ({ ...e, createdAt: e.timestamp })));
  const cByDay = groupByDate(contacts.map(e => ({ ...e, createdAt: e.timestamp })));
  const aByDay = groupByDate(appointments.map(e => ({ ...e, createdAt: e.timestamp })));

  const chartData = last7Days.map((day) => ({
    date: day.split("-").slice(1).join("/"),
    pageviews: pvByDay[day]?.length || 0,
    contacts: cByDay[day]?.length || 0,
    appointments: aByDay[day]?.length || 0,
  }));

  // Top pages
  const pageCount: Record<string, number> = {};
  pageviews.forEach((e) => {
    pageCount[e.page] = (pageCount[e.page] || 0) + 1;
  });
  const topPages = Object.entries(pageCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const weekViews = last7Days.reduce(
    (sum, day) => sum + (pvByDay[day]?.length || 0),
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">Analytics</h1>
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Últimos 7 dias e estatísticas gerais
      </p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Views (7 dias)", value: weekViews, total: pageviews.length },
          { label: "Contatos", value: contacts.length, total: null },
          { label: "Agendamentos", value: appointments.length, total: null },
          { label: "Cliques WhatsApp", value: whatsapp.length, total: null },
        ].map((item) => (
          <div key={item.label} className="bg-[var(--surface)] border border-[var(--border)] p-4 rounded">
            <div className="text-2xl font-bold text-[var(--gold)]">{item.value}</div>
            <div className="text-xs uppercase tracking-widest text-[var(--text-muted)] mt-1">{item.label}</div>
            {item.total !== null && (
              <div className="text-xs text-[var(--text-muted)] mt-0.5">{item.total} total</div>
            )}
          </div>
        ))}
      </div>

      {/* Area chart */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--foreground)] mb-4">
          Tráfego — Últimos 7 dias
        </h2>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="pvGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#d4af37" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#d4af37" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis dataKey="date" tick={{ fill: "#8a8a8a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8a8a8a", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2e2e2e",
                color: "#f0ede6",
              }}
            />
            <Area
              type="monotone"
              dataKey="pageviews"
              name="Page Views"
              stroke="#d4af37"
              fill="url(#pvGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Bar chart */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded mb-6">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--foreground)] mb-4">
          Conversões — Últimos 7 dias
        </h2>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2e2e2e" />
            <XAxis dataKey="date" tick={{ fill: "#8a8a8a", fontSize: 11 }} />
            <YAxis tick={{ fill: "#8a8a8a", fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1a1a1a",
                border: "1px solid #2e2e2e",
                color: "#f0ede6",
              }}
            />
            <Legend wrapperStyle={{ color: "#8a8a8a", fontSize: 11 }} />
            <Bar dataKey="contacts" name="Contatos" fill="#22c55e" radius={[2, 2, 0, 0]} />
            <Bar dataKey="appointments" name="Agendamentos" fill="#3b82f6" radius={[2, 2, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Top pages */}
      <div className="bg-[var(--surface)] border border-[var(--border)] p-6 rounded">
        <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--foreground)] mb-4">
          Páginas Mais Visitadas
        </h2>
        {topPages.length === 0 ? (
          <p className="text-[var(--text-muted)] text-sm">Sem dados ainda.</p>
        ) : (
          <ul className="space-y-2">
            {topPages.map(([page, count]) => (
              <li key={page} className="flex items-center justify-between">
                <span className="text-[var(--foreground)] text-sm font-mono">{page}</span>
                <span className="text-[var(--gold)] text-sm font-semibold">{count}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
