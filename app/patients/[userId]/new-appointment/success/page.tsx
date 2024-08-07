import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { getAppointment } from "@/lib/actions/appointment.actions";
import { getUser } from "@/lib/actions/paient.actions";
import { formatDateTime } from "@/lib/utils";
import { CalendarCheck, CheckCircle2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import * as Sentry from "@sentry/nextjs";

const Success = async ({
  params: { userId },
  searchParams,
}: SearchParamProps) => {
  const appointmentId = (searchParams?.appointmentId as string) || "";
  const appointment = await getAppointment(appointmentId);
  const doctor = Doctors.find(
    (doc) => doc.name === appointment?.primaryPhysician
  );

  // const user = await getUser(userId);
  // Sentry.metrics.set("user_view_appointment-success", user.name);

  return (
    <div className="flex h-screen max-h-screen px-[5%]">
      <div className="success-img">
        <Link href="/">
          <Image
            src="/assets/icons/logo-full.svg"
            alt="logo"
            width={1000}
            height={1000}
            className="h-10 w-fit"
          />
        </Link>
        <section className="flex flex-col items-center">
          <Image
            src="/assets/gifs/check-circle.svg"
            alt="success"
            width={75}
            height={75}
            className="shadow-custom-dark rounded-full mb-5"
          />
          {/* <Image
            src="/assets/gifs/success.gif"
            alt="success"
            width={300}
            height={280}
            className=""
          /> */}
          <h2 className="header mb-6 max-w-[600px] text-center">
            Your <span className="text-green-400">appointment request</span> has
            been successfully submitted!
          </h2>
          <p className="text-dark-700">We'll be in touch shortly to confirm.</p>
        </section>
        <section className="request-details text-dark-700">
          <p>Requested appointment details: </p>
          <div className="flex items-center max-sm:flex-col gap-6">
            <div
              className={`flex items-center gap-2 p-3 h-11 rounded-md border border-dark-500 custom-gradient`}
            >
              <Image
                src={doctor?.image!}
                alt={doctor?.name!}
                width={24}
                height={24}
                className="rounded-full"
              />
              <p className="text-sm text-white">{doctor?.name}</p>
            </div>
            <div className="flex gap-2">
              <CalendarCheck size={24} />
              <p>{formatDateTime(appointment?.schedule).dateTime}</p>
            </div>
          </div>
        </section>
        <Button className="shad-primary-btn" asChild>
          <Link href={`/patients/${userId}/new-appointment`}>
            New Appointment
          </Link>
        </Button>
        <p className="copyright">@ {new Date().getFullYear()} CarePulse</p>
      </div>
    </div>
  );
};

export default Success;
