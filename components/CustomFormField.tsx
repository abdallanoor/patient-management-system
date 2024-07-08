"use client";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import { FormFieldType } from "./forms/PatientForm";
import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js";

interface CustomProps {
  control: Control<any>;
  fieldType: FormFieldType;
  name: string;
  lable?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
  dateFormat?: string;
  showTimeSelect?: boolean;
  children?: ReactNode;
  renderSkeleton?: (field: any) => ReactNode;
}

const CustomFormField = (props: CustomProps) => {
  const { control, fieldType, name, lable, placeholder, iconSrc, iconAlt } =
    props;

  // const RenderField = ({
  //   field,
  //   props,
  // }: {
  //   field: any;
  //   props: CustomProps;
  // }) => {
  //   const { fieldType, placeholder, iconSrc, iconAlt } = props;
  //   const { INPUT, PHONE_INPUT } = FormFieldType;
  //   switch (fieldType) {
  //     case INPUT:
  //       return (
  //         <FormControl>
  //           <div className="relative">
  //             <Input
  //               className={cn("shad-input", { "pl-10": iconSrc })}
  //               placeholder={placeholder}
  //               {...field}
  //             />
  //             {iconSrc && (
  //               <Image
  //                 src={iconSrc}
  //                 width={24}
  //                 height={24}
  //                 alt={iconAlt || "icon"}
  //                 className="w-6 h-6 absolute left-2 top-1/2 translate-y-[-50%]"
  //               />
  //             )}
  //           </div>
  //         </FormControl>
  //       );
  //     case PHONE_INPUT:
  //       return (
  //         <FormControl>
  //           <PhoneInput
  //             defaultCountry="EG"
  //             placeholder={placeholder}
  //             international
  //             withCountryCallingCode
  //             value={field.value as E164Number | undefined}
  //             onChange={field.onChange}
  //             className="input-phone"
  //           />
  //         </FormControl>
  //       );
  //     default:
  //       break;
  //   }
  // };
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem>
          {fieldType !== FormFieldType.CHECKBOX && lable && (
            <FormLabel>{lable}</FormLabel>
          )}
          {fieldType === FormFieldType.INPUT && (
            <FormControl>
              <div className="relative">
                <Input
                  className={cn("shad-input", { "pl-10": iconSrc })}
                  placeholder={placeholder}
                  {...field}
                />
                {iconSrc && (
                  <Image
                    src={iconSrc}
                    width={24}
                    height={24}
                    alt={iconAlt || "icon"}
                    className="w-6 h-6 absolute left-2 top-1/2 translate-y-[-50%]"
                  />
                )}
              </div>
            </FormControl>
          )}
          {fieldType === FormFieldType.PHONE_INPUT && (
            <FormControl>
              <PhoneInput
                defaultCountry="EG"
                placeholder={placeholder}
                international
                withCountryCallingCode
                value={field.value as E164Number | undefined}
                onChange={field.onChange}
                className="input-phone"
              />
            </FormControl>
          )}
          {/* <RenderField field={field} props={props} /> */}

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
