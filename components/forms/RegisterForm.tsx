"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form, FormControl } from "@/components/ui/form";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { useState } from "react";
import { PatientFormValidation } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { RadioGroup } from "@radix-ui/react-radio-group";
import { RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { SelectItem } from "../ui/select";
import {
  Doctors,
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import Image from "next/image";
import FileUploader from "../FileUploader";
import { cn } from "@/lib/utils";
import { registerPatient } from "@/lib/actions/paient.actions";

type Field = "primaryPhysician" | "identificationType";

const RegisterForm = ({ user }: { user: User }) => {
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();
  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: user.name,
      email: user.email,
      phone: user.phone,
    },
  });

  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);
    // Store file info in form data as
    let formData;
    if (
      values.identificationDocument &&
      values.identificationDocument?.length > 0
    ) {
      const blobFile = new Blob([values.identificationDocument[0]], {
        type: values.identificationDocument[0].type,
      });

      formData = new FormData();
      formData.append("blobFile", blobFile);
      formData.append("fileName", values.identificationDocument[0].name);
    }

    try {
      const patient = {
        userId: user.$id,
        name: values.name,
        email: values.email,
        phone: values.phone,
        birthDate: new Date(values.birthDate),
        gender: values.gender,
        address: values.address,
        occupation: values.occupation,
        emergencyContactName: values.emergencyContactName,
        emergencyContactNumber: values.emergencyContactNumber,
        primaryPhysician: values.primaryPhysician,
        insuranceProvider: values.insuranceProvider,
        insurancePolicyNumber: values.insurancePolicyNumber,
        allergies: values.allergies,
        currentMedication: values.currentMedication,
        familyMedicalHistory: values.familyMedicalHistory,
        pastMedicalHistory: values.pastMedicalHistory,
        identificationType: values.identificationType,
        identificationNumber: values.identificationNumber,
        identificationDocument: values.identificationDocument
          ? formData
          : undefined,
        privacyConsent: values.privacyConsent,
        treatmentConsent: values.treatmentConsent,
        disclosureConsent: values.disclosureConsent,
      };

      const newPatient = await registerPatient(patient);

      if (newPatient) {
        router.push(`/patients/${user.$id}/new-appointment`);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-12 flex-1"
      >
        <section className="space-y-2">
          <h1 className="header">Welcome 👋</h1>
          <p className="dark:text-dark-700">Let us know more about yourself.</p>
        </section>
        <section className="flex flex-col gap-14">
          <div className="space-y-8">
            <h2 className="sub-header">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <CustomFormField
                  fieldType={FormFieldType.INPUT}
                  control={form.control}
                  name="name"
                  lable="Full Name"
                  placeholder="ex: Abdallah"
                />
              </div>
              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="email"
                lable="Email"
                placeholder="abdallaahnoor@gmail.com"
                iconSrc="/assets/icons/email.svg"
                iconAlt="email"
              />
              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="phone"
                lable="Phone Number"
                placeholder="+20-11-xxxx-xxxx"
                iconSrc="/assets/icons/phone.svg"
                iconAlt="phone"
              />
              <CustomFormField
                fieldType={FormFieldType.DATE_PICKER}
                control={form.control}
                name="birthDate"
                lable="Date of birth"
                placeholder="Select your birth date"
                iconSrc="/assets/icons/calendar.svg"
                iconAlt="Date of birth"
              />
              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="gender"
                lable="Gender"
                renderSkeleton={(field) => (
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex h-12 gap-5 xl:justify-between"
                    >
                      {["male", "female"].map((option) => (
                        <div key={option} className="radio-group">
                          <RadioGroupItem
                            value={option}
                            id={option}
                            defaultValue={"male"}
                            className="bg-dark-400 border-dark-500"
                          />
                          <Label htmlFor={option} className="cursor-pointer">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                )}
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="address"
                lable="Address"
                placeholder="ex: 34 Degla St., Mohandessin"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="occupation"
                lable="Occupation"
                placeholder="Software Engineer"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="emergencyContactName"
                lable="Emergency Contact Name"
                placeholder="Guardian's name"
              />

              <CustomFormField
                fieldType={FormFieldType.PHONE_INPUT}
                control={form.control}
                name="emergencyContactNumber"
                lable="Emergency Contact Number"
                placeholder="+20-11-xxxx-xxxx"
                iconSrc="/assets/icons/phone.svg"
                iconAlt="phone"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="sub-header">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="col-span-1 md:col-span-2">
                <CustomFormField
                  fieldType={FormFieldType.SELECT}
                  control={form.control}
                  name="primaryPhysician"
                  lable="Primary physician"
                  placeholder="Select a Physician"
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
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insuranceProvider"
                lable="Insurance provider"
                placeholder="ex: BlueCross BlueShield"
              />

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="insurancePolicyNumber"
                lable="Insurance policy number"
                placeholder="ex: AC1234567"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="allergies"
                lable="Allergies (if any)"
                placeholder="ex: Peanuts, Penicillin, Pollen"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="currentMedications"
                lable="Current medications"
                placeholder="ex: Ibuprofen 200mg, Levothyroxine 50mcg"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="familyMedicalHistory"
                lable="Family medical history (if relevant)"
                placeholder="ex: Mother had breast cancer"
              />

              <CustomFormField
                fieldType={FormFieldType.TEXTAREA}
                control={form.control}
                name="pastMedicalHistory"
                lable="Past medical history"
                placeholder="ex: Asthma diagnosis in childhood"
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="sub-header">Identification and Verfication</h2>
            <div className="grid grid-cols-1 gap-5">
              <CustomFormField
                fieldType={FormFieldType.SELECT}
                control={form.control}
                name="identificationType"
                lable="Identification type"
                placeholder="Select identification type"
              >
                {IdentificationTypes.map((type) => (
                  <SelectItem
                    key={type}
                    value={type}
                    className="cursor-pointer hover:bg-select-gradient border border-transparent hover:border-dark-500 rounded data-[state=checked]:bg-select-gradient data-[state=checked]:border-dark-500"
                  >
                    {type}
                  </SelectItem>
                ))}
              </CustomFormField>

              <CustomFormField
                fieldType={FormFieldType.INPUT}
                control={form.control}
                name="identificationNumber"
                lable="Identification Number"
                placeholder="ex 1234567"
              />

              <CustomFormField
                fieldType={FormFieldType.SKELETON}
                control={form.control}
                name="identificationDocument"
                lable="Scanned Copy of Identification Document"
                renderSkeleton={(field) => (
                  <FormControl>
                    <FileUploader
                      files={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                )}
              />
            </div>
          </div>

          <div className="space-y-8">
            <h2 className="sub-header">Consent and Privacy</h2>
            <div className="grid grid-cols-1 gap-5">
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="treatmentConsent"
                lable="I consent to treatment"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="disclosureConsent"
                lable="I consent to desclosure of information"
              />
              <CustomFormField
                fieldType={FormFieldType.CHECKBOX}
                control={form.control}
                name="privacyConsent"
                lable="I consent to privacy policy"
              />
            </div>
          </div>
        </section>

        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};

export default RegisterForm;
