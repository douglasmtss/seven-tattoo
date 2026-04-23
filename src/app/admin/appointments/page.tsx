import { getAppointments } from "@/lib/data";
import AppointmentManager from "@/components/admin/AppointmentManager";

export const dynamic = "force-dynamic";

export default function AdminAppointmentsPage() {
  const appointments = getAppointments();
  return <AppointmentManager initialAppointments={appointments} />;
}
