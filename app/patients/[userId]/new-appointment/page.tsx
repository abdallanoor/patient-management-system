import AppointmentForm from "@/components/forms/AppointmentForm";
import { getPatient } from "@/lib/actions/paient.actions";
import Image from "next/image";
import * as Sentry from "@sentry/nextjs";

const Appointment = async ({ params: { userId } }: SearchParamProps) => {
  const patient = await getPatient(userId);
  // Sentry.metrics.set("user_view_new-appointment", patient.name);

  return (
    <div className="flex h-screen max-h-screen">
      <section className="remove-scrollbar container  ">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/Logo.svg"
            alt="patient"
            width={161}
            height={32}
            className="mb-10 h-10 w-fit invert dark:invert-0"
          />
          <AppointmentForm
            type="create"
            userId={userId}
            patientId={patient.$id}
          />

          <p className="copyright py-10">
            @ {new Date().getFullYear()} CarePulse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/appointment-img.png"
        alt="appointment"
        width={1000}
        height={1000}
        className="side-img max-w-[390px] md:w-[30%] bg-bottom"
      />
    </div>
  );
};

export default Appointment;
