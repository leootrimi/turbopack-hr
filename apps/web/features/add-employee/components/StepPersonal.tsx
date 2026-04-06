import { useFormContext } from "react-hook-form";
import { Field, Input, Textarea } from "../../../components/components/FormFields";
import { User, Mail, Phone, Calendar, CreditCard, MapPin, Heart } from "lucide-react";
import { EmployeeForm } from "@repo/types";

export function StepPersonal() {
  const { register, formState: { errors } } = useFormContext<EmployeeForm>();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-0.5">Basic details and contact information for the new employee.</p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" required error={errors.personal?.firstName?.message}>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="John"
              {...register("personal.firstName")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Last Name" required error={errors.personal?.lastName?.message}>
          <Input
            placeholder="Doe"
            {...register("personal.lastName")}
          />
        </Field>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email Address" required error={errors.personal?.email?.message}>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="email"
              placeholder="john.doe@company.com"
              {...register("personal.email")}
              className="pl-9"
            />
          </div>
        </Field>

        <div className="col-span-2">
          <Field label="Personal Email" hint="Used for account-created emails (optional)" error={errors.personal?.personalEmail?.message}>
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                {...register("personal.personalEmail")}
                className="pl-9"
              />
            </div>
          </Field>
        </div>

        <Field label="Phone Number" required error={errors.personal?.phone?.message}>
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="tel"
              placeholder="+381 60 000 0000"
              {...register("personal.phone")}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      {/* DOB + Personal No */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of Birth" required error={errors.personal?.dateOfBirth?.message}>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              {...register("personal.dateOfBirth")}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Personal Number / ID" hint="National ID or passport number" required error={errors.personal?.personalNumber?.message}>
          <div className="relative">
            <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="1234567890123"
              {...register("personal.personalNumber")}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      {/* Address */}
      <Field label="Home Address" required error={errors.personal?.address?.message}>
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <Textarea
            placeholder="Street, City, Postal Code, Country"
            rows={2}
            {...register("personal.address")}
            className="pl-9"
          />
        </div>
      </Field>

      {/* Emergency contact */}
      <Field label="Emergency Contact" hint="Name and phone number of the person to contact in an emergency" required error={errors.personal?.emergencyContact?.message}>
        <div className="relative">
          <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Jane Doe — +381 60 111 2222"
            {...register("personal.emergencyContact")}
            className="pl-9"
          />
        </div>
      </Field>
    </div>
  );
}
