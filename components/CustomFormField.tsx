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
import { ReactNode } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import { E164Number } from "libphonenumber-js";
import DatePicker from "react-datepicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import "react-datepicker/dist/react-datepicker.css";
import { Textarea } from "./ui/textarea";
import { Checkbox } from "./ui/checkbox";

export enum FormFieldType {
  INPUT = "input",
  TEXTAREA = "textarea",
  PHONE_INPUT = "phoneIput",
  SELECT = "select",
  CHECKBOX = "checkbox",
  DATE_PICKER = "datePicker",
  SKELETON = "skeleton",
}

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
  handleValueChange?: (value: any) => ReactNode;
}

const CustomFormField = (props: CustomProps) => {
  const {
    control,
    fieldType,
    name,
    lable,
    placeholder,
    iconSrc,
    iconAlt,
    dateFormat,
    showTimeSelect,
    renderSkeleton,
    children,
    disabled,
    handleValueChange = () => {},
  } = props;

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
                onChange={field.onChange}
                className="input-phone"
              />
            </FormControl>
          )}
          {fieldType === FormFieldType.DATE_PICKER && (
            <FormControl>
              <div className="relative">
                <DatePicker
                  selected={field.value}
                  onChange={(date) => field.onChange(date)}
                  dateFormat={dateFormat ?? "dd/MM/yyyy"}
                  showTimeSelect={showTimeSelect ?? false}
                  timeInputLabel="Time:"
                  placeholderText={placeholder}
                  className={cn("shad-input border rounded-md", {
                    "pl-10": iconSrc,
                  })}
                  wrapperClassName="w-full"
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
          {fieldType === FormFieldType.SKELETON &&
            (renderSkeleton ? renderSkeleton(field) : null)}

          {fieldType === FormFieldType.SELECT && (
            <FormControl>
              <Select
                onValueChange={(value) => {
                  if (field?.onChange) {
                    field.onChange(value);
                  }
                  handleValueChange(value); // Update local state for CSS class control
                }}
              >
                <FormControl>
                  <SelectTrigger className="shad-select-trigger">
                    <SelectValue placeholder={placeholder} />
                  </SelectTrigger>
                </FormControl>

                <SelectContent className="shad-select-content">
                  <div className="flex flex-col gap-1">{children}</div>
                </SelectContent>
              </Select>
            </FormControl>
          )}

          {fieldType === FormFieldType.TEXTAREA && (
            <FormControl>
              <Textarea
                placeholder={placeholder}
                {...field}
                className="shad-textArea"
                disabled={disabled}
              />
            </FormControl>
          )}

          {fieldType === FormFieldType.CHECKBOX && (
            <FormControl>
              <div className="flex items-center gap-3">
                <Checkbox
                  id={name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  className="bg-dark-400 border-dark-500 data-[state=checked]:bg-green-500"
                />
                <label htmlFor={field.name} className="checkbox-label">
                  {lable}
                </label>
              </div>
            </FormControl>
          )}

          <FormMessage className="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomFormField;
