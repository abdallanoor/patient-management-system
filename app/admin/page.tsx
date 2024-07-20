import LogoutModal from "@/components/LogoutModal";
import StatCard from "@/components/StatCard";
import columns from "@/components/table/columns";
import DataTable from "@/components/table/DataTable";
import { getRecentAppointmentList } from "@/lib/actions/appointment.actions";
import Image from "next/image";
import Link from "next/link";

const Admin = async () => {
  const appointments = await getRecentAppointmentList();

  return (
    <div className="mx-auto flex flex-col max-w-7xl space-y-14 p-3">
      <div className="admin-header">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={1000}
            height={1000}
            className="h-8 w-fit"
          />
        </Link>
        <LogoutModal />
      </div>
      <main className="admin-main">
        <section className="space-y-4 w-full">
          <h1 className="header">Welcome, Admin</h1>
          <p className="text-dark-700">
            Start day with managing new appointments
          </p>
        </section>
        <section className="admin-stat">
          <StatCard
            type="appointments"
            label="Total Appointments"
            count={appointments.scheduledAppointments}
            icon="/assets/icons/appointments.svg"
          />
          <StatCard
            type="pending"
            label="Pending Appointments"
            count={appointments.pendingAppointments}
            icon="/assets/icons/pending.svg"
          />
          <StatCard
            type="canceled"
            label="canceled Appointments"
            count={appointments.canceledAppointments}
            icon="/assets/icons/canceled.svg"
          />
        </section>
        <DataTable columns={columns} data={appointments.documents} />
      </main>
    </div>
  );
};

export default Admin;
