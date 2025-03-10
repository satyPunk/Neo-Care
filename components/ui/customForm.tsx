"use client";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import Image from "next/image"
import DatePicker from "react-datepicker"
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FieldType } from "@/components/forms/Patientform"; // ✅ Import Enum
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
interface CustomProps {
  control: Control<any>;
  fieldType: FieldType;
  name: string;
  label?: string;
  placeholder?: string;
  iconSrc?: string;
  iconAlt?: string;
  disabled?: boolean;
}
const RenderField = ({field, props } : {field: any; props:CustomProps })=>{
    const {fieldType, iconSrc ,iconAlt ,placeholder} =props;
    switch (fieldType){
        case FieldType.INPUT:
            
            return (
                <div className ="flex rounded-md boreder-dark-500 bg-dark-400">
                    {iconSrc && (
                        <Image
                        src={ iconSrc}
                        height ={24}
                        width ={24}
                        alt = {iconAlt || 'icon'}
                        className ="ml-2"
                        />
                    )}
                    <FormControl>
                        <Input
                        placeholder ={placeholder}
                        {...field}
                        className="shad-input border-0"
                        />
                    </FormControl>
                </div>
            );

        case FieldType.PHONE_INPUT:
            return (
                <FormControl>
                    <PhoneInput
                    defaultCountry ="US"
                    placeholder ={placeholder}
                    international 
                    withCountryCallingCode
                    value ={field.value as E164Number | undefined}
                    onChange ={field.onChange}
                    className ="input-phone"
                     />
                </FormControl>
            );
        case FieldType.DATE_PICKER:
          return(
            <div className="flex rounded-md border border-dark-500 bg-dark-400">
              <Image
              src="/assets/icons/calendar.svg"
              height={24}
              width={24}
              alt ="Calendar"
              className="ml-12"
              />
              <FormControl>
                <DatePicker selected={field.value} onChange={(date)=>field.onChange(date)}/>
              </FormControl>
            </div>
          )
    }

}
const CustomForm = (props: CustomProps) => {
    const {control ,fieldType, name ,label} =props;
  return (
    <FormField
      control={control}
      name={name}
      render={({ field }) => (
        <FormItem className="flex-1">
          {fieldType !== FieldType.CHECKBOX && label && <FormLabel>{label}</FormLabel>}
          <RenderField field ={field} props ={props} />
          <FormMessage className ="shad-error" />
        </FormItem>
      )}
    />
  );
};

export default CustomForm;
