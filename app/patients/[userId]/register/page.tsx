import RegisterForm from "@/components/forms/RegisterForm";
import { getPatient, getUser } from "@/lib/actions/paient.actions";
import Image from "next/image";
import React from "react";

import * as Sentry from "@sentry/nextjs";

const Register = async ({ params: { userId } }: SearchParamProps) => {
  const user = await getUser(userId);
  const patient = await getPatient(userId);

  // Sentry.metrics.set("user_view_register", user.name);

  return (
    <div className="flex">
      <section className="remove-scrollbar container">
        <div className="sub-container max-w-[860px] flex-1 flex-col py-10">
          <Image
            src="/Logo.svg"
            alt="patient"
            width={161}
            height={32}
            className="mb-10 h-10 w-fit invert dark:invert-0"
          />
          <RegisterForm user={user} patient={patient} />

          <p className="copyright py-10">
            @ {new Date().getFullYear()} CarePulse
          </p>
        </div>
      </section>
      <Image
        src="/assets/images/register-img.png"
        alt="dd"
        width={1000}
        height={1000}
        className="side-img h-[1000px] max-w-[390px] md:w-[30%]"
      />
    </div>
  );
};

export default Register;
