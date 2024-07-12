"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { CreateAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { createAppointment } from "@/lib/actions/appointment.actions";

const AppointmentForm = ({
  patientId,
  userId,
  type,
}: {
  patientId: string;
  userId: string;
  type: "create" | "cancel" | "schedule";
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedValue, setSelectedValue] = useState(null);

  const handleValueChange = (value: any) => {
    setSelectedValue(value);
    return null;
  };

  const router = useRouter();
  const form = useForm<z.infer<typeof CreateAppointmentSchema>>({
    resolver: zodResolver(CreateAppointmentSchema),
    defaultValues: {
      primaryPhysician: "",
      schedule: new Date(),
      reason: "",
      note: "",
      cancellationReason: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof CreateAppointmentSchema>) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case "schedule":
        status = "scheduled";
      case "cancel":
        status = "canceled";
        break;
      default:
        status = "pending";
        break;
    }

    if (type === "create" && patientId) {
      const appointmentData = {
        userId,
        patient: patientId,
        schedule: new Date(values.schedule),
        status: status as Status,
        primaryPhysician: values.primaryPhysician,
        reason: values.reason,
        note: values.note,
      };
      const appointment = await createAppointment(appointmentData);

      if (appointment) {
        form.reset();
        router.push(
          `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
        );
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
    case "cancel":
      btnLabel = "Cancel Appointment";

    case "schedule":
      btnLabel = "Schedule Appointment";
      break;

    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-9 flex-1">
        <section className="mb-12 space-y-2">
          <h1 className="header">New Appointment</h1>
          <p className="dark:text-dark-700">
            Request a new appointment in 10 seconds.
          </p>
        </section>
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
                    handleValueChange={handleValueChange}
                  >
                    {Doctors.map((doctor) => (
                      <SelectItem
                        key={doctor.name}
                        value={doctor.name}
                        className={`cursor-pointer border border-dark-100 rounded-md ${
                          selectedValue === doctor.name
                            ? "bg-select-gradient  border-dark-500"
                            : "hover:bg-select-gradient hover:border-dark-500"
                        }`}
                      >
                        <div
                          className={`flex items-center gap-2 p-3 h-9 rounded-md ${
                            selectedValue === doctor.name &&
                            "border border-dark-500 custom-gradient"
                          }`}
                        >
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
