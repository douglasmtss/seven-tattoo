import {
  MessageSquare,
  Calendar,
  Image as ImageIcon,
  BarChart2,
} from "lucide-react";
import StatsCard from "@/components/admin/StatsCard";
import {
  getMessages,
  getAppointments,
  getGallery,
  getAnalytics,
} from "@/lib/data";
import { getLast7Days, groupByDate } from "@/lib/utils";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default function AdminDashboard() {
  const messages = getMessages();
  const appointments = getAppointments();
  const gallery = getGallery();
  const analytics = getAnalytics();

  const unreadMessages = messages.filter((m) => !m.read).length;
  const pendingAppointments = appointments.filter(
    (a) => a.status === "pending"
  ).length;

  const pageviews = analytics.filter((e) => e.type === "pageview");
  const totalViews = pageviews.length;

  const last7Days = getLast7Days();
  const viewsByDay = groupByDate(pageviews.map(e => ({ ...e, createdAt: e.timestamp })));
  const weekViews = last7Days.reduce(
    (sum, day) => sum + (viewsByDay[day]?.length || 0),
    0
  );

  const recentMessages = messages.slice(0, 5);
  const recentAppointments = appointments.slice(0, 5);

  return (
    <div>
      <h1 className="text-2xl font-bold text-[var(--foreground)] mb-2">
        Dashboard
      </h1>
      <p className="text-[var(--text-muted)] text-sm mb-8">
        Visão geral do estúdio Seven Tattoo
      </p>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        <StatsCard
          title="Mensagens"
          value={messages.length}
          subtitle={`${unreadMessages} não lidas`}
          icon={<MessageSquare size={22} />}
          accent={unreadMessages > 0}
        />
        <StatsCard
          title="Agendamentos"
          value={appointments.length}
          subtitle={`${pendingAppointments} pendentes`}
          icon={<Calendar size={22} />}
          accent={pendingAppointments > 0}
        />
        <StatsCard
          title="Galeria"
          value={gallery.length}
          subtitle="Tatuagens"
          icon={<ImageIcon size={22} />}
        />
        <StatsCard
          title="Views (7 dias)"
          value={weekViews}
          subtitle={`${totalViews} total`}
          icon={<BarChart2 size={22} />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent messages */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--foreground)]">
              Mensagens Recentes
            </h2>
            <Link
              href="/admin/messages"
              className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] tracking-widest uppercase"
            >
              Ver todas
            </Link>
          </div>
          {recentMessages.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">Nenhuma mensagem.</p>
          ) : (
            <ul className="space-y-3">
              {recentMessages.map((msg) => (
                <li
                  key={msg.id}
                  className={`border-l-2 pl-3 py-1 ${msg.read ? "border-[var(--border)]" : "border-[var(--gold)]"}`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--foreground)] text-sm font-medium">
                      {msg.name}
                    </span>
                    {!msg.read && (
                      <span className="text-xs bg-[var(--gold)] text-[#0d0d0d] px-1.5 py-0.5 rounded">
                        Nova
                      </span>
                    )}
                  </div>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5 line-clamp-1">
                    {msg.message}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Recent appointments */}
        <div className="bg-[var(--surface)] border border-[var(--border)] rounded p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold uppercase tracking-widest text-[var(--foreground)]">
              Agendamentos Recentes
            </h2>
            <Link
              href="/admin/appointments"
              className="text-xs text-[var(--gold)] hover:text-[var(--gold-light)] tracking-widest uppercase"
            >
              Ver todos
            </Link>
          </div>
          {recentAppointments.length === 0 ? (
            <p className="text-[var(--text-muted)] text-sm">Nenhum agendamento.</p>
          ) : (
            <ul className="space-y-3">
              {recentAppointments.map((appt) => (
                <li
                  key={appt.id}
                  className="border-l-2 pl-3 py-1"
                  style={{
                    borderColor:
                      appt.status === "pending"
                        ? "var(--gold)"
                        : appt.status === "approved"
                          ? "#22c55e"
                          : appt.status === "rejected"
                            ? "#ef4444"
                            : "var(--border)",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--foreground)] text-sm font-medium">
                      {appt.name}
                    </span>
                    <span
                      className={`text-xs px-1.5 py-0.5 rounded ${
                        appt.status === "pending"
                          ? "bg-yellow-900/50 text-yellow-400"
                          : appt.status === "approved"
                            ? "bg-green-900/50 text-green-400"
                            : appt.status === "rejected"
                              ? "bg-red-900/50 text-red-400"
                              : "bg-[var(--surface-2)] text-[var(--text-muted)]"
                      }`}
                    >
                      {appt.status === "pending"
                        ? "Pendente"
                        : appt.status === "approved"
                          ? "Aprovado"
                          : appt.status === "rejected"
                            ? "Rejeitado"
                            : "Concluído"}
                    </span>
                  </div>
                  <p className="text-[var(--text-muted)] text-xs mt-0.5">
                    {appt.placement} · {appt.size}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
