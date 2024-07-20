"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import {
  createAppointment,
  updateAppointment,
} from "@/lib/actions/appointment.actions";
import { Appointment } from "@/types/appwrite.types";
import { Button } from "../ui/button";
import Loading from "@/app/loading";
import { toast } from "../ui/use-toast";

const AppointmentForm = ({
  patientId,
  userId,
  type = "create",
  appointment,
  setOpen,
}: {
  patientId: string;
  userId: string;
  type: "create" | "cancel" | "schedule";
  appointment?: Appointment;
  setOpen?: (open: boolean) => void;
}) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const AppointmentFormValidation = getAppointmentSchema(type);
  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : "",
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment?.reason : "",
      note: appointment?.note || "",
      cancellationReason: appointment?.cancellationReason || "",
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);
    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
        break;
      case "cancel":
        status = "canceled";
        break;
      default:
        status = "pending";
    }
    if (type === "create" && patientId) {
      const appointmentData = {
        userId,
        patient: patientId,
        schedule: new Date(values.schedule),
        status: status as Status,
        primaryPhysician: values.primaryPhysician,
        reason: values.reason!,
        note: values.note,
      };
      const appointment = await createAppointment(appointmentData);
      if (appointment) {
        toast({
          title: "Appointment successfully created",
        });
        form.reset();
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
        );
      }
    } else {
      const appointmentToUpdate = {
        userId,
        appointmentId: appointment?.$id!,
        appointment: {
          primaryPhysician: values?.primaryPhysician,
          schedule: new Date(values?.schedule),
          status: status as Status,
          cancellationReason: values?.cancellationReason,
        },
        type,
      };

      const update = await updateAppointment(appointmentToUpdate);
      if (update) {
        toast({
          title: "Appointment successfully updated",
        });
        setOpen && setOpen(false);
        form.reset();
      }
    }
    try {
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  let btnLabel;
  switch (type) {
    case "create":
      btnLabel = "Create Appointment";
      break;
    case "cancel":
      btnLabel = "Cancel Appointment";
      break;
    case "schedule":
      btnLabel = "Schedule Appointment";
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 flex-1">
        {type === "create" && (
          <section className="mb-12 space-y-2">
            <h1 className="header">New Appointment</h1>
            <p className="dark:text-dark-700">
              Request a new appointment in 10 seconds.
            </p>
          </section>
        )}
        <section className="flex flex-col gap-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {type !== "cancel" && (
              <>
                <div className="col-span-1 md:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.SELECT}
                    control={form.control}
                    name="primaryPhysician"
                    lable="Doctor"
                    placeholder="Select a Doctor"
                  >
                    {Doctors.map((doctor) => (
                      <SelectItem
                        key={doctor.name}
                        value={doctor.name}
                        className="cursor-pointer border border-dark-100 hover:bg-select-gradient hover:border-dark-500 rounded-md data-[state=checked]:bg-select-gradient data-[state=checked]:border-dark-500"
                      >
                        <div className="flex cursor-pointer items-center gap-2">
                          <Image
                            src={doctor.image}
                            alt={doctor.name}
                            width={24}
                            height={24}
                            className="rounded-full"
                          />
                          <p>{doctor.name}</p>
                        </div>
                      </SelectItem>
                    ))}
                  </CustomFormField>
                </div>

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  lable="Reason for appointment"
                  placeholder="ex: Annual montly check-up"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  lable="Notes"
                  placeholder="ex: Prefer afternoon appointments, if possible"
                />

                <div className="col-span-1 md:col-span-2">
                  <CustomFormField
                    fieldType={FormFieldType.DATE_PICKER}
                    control={form.control}
                    name="schedule"
                    lable="Expected appointment date"
                    placeholder="Select your appointment date"
                    iconSrc="/assets/icons/calendar.svg"
                    iconAlt="schedule"
                    showTimeSelect
                    dateFormat="dd/MM/yyyy - h:mm aa"
                  />
                </div>
              </>
            )}

            {type === "cancel" && (
              <div className="col-span-1 md:col-span-2">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="cancellationReason"
                  lable="Reason for cancellation"
                  placeholder="Enter reason for cancellation"
                />
              </div>
            )}
          </div>

          <SubmitButton
            isLoading={isLoading}
            className={cn({
              "shad-danger-btn": type === "cancel",
              "shad-primary-btn": type !== "cancel",
            })}
          >
            {btnLabel}
          </SubmitButton>
        </section>
      </form>
    </Form>
  );
};

export default AppointmentForm;
