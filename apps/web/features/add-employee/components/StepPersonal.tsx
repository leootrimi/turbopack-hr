import { PersonalInfo } from "./types";
import { Field, Input, Textarea } from "../../../components/components/FormFields";
import { User, Mail, Phone, Calendar, CreditCard, MapPin, Heart } from "lucide-react";

interface Props {
  data: PersonalInfo;
  onChange: <K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) => void;
}

export function StepPersonal({ data, onChange }: Props) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Personal Information</h2>
        <p className="text-sm text-slate-500 mt-0.5">Basic details and contact information for the new employee.</p>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="First Name" required>
          <div className="relative">
            <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="John"
              value={data.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Last Name" required>
          <Input
            placeholder="Doe"
            value={data.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
          />
        </Field>
      </div>

      {/* Contact row */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Email Address" required>
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="email"
              placeholder="john.doe@company.com"
              value={data.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>

        <div className="col-span-2">
          <Field label="Personal Email" hint="Used for account-created emails (optional)">
            <div className="relative">
              <Mail
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
              />
              <Input
                type="email"
                placeholder="john.doe@gmail.com"
                value={data.personalEmail ?? ""}
                onChange={(e) =>
                  onChange("personalEmail", e.target.value)
                }
                className="pl-9"
              />
            </div>
          </Field>
        </div>

        <Field label="Phone Number">
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="tel"
              placeholder="+381 60 000 0000"
              value={data.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      {/* DOB + Personal No */}
      <div className="grid grid-cols-2 gap-4">
        <Field label="Date of Birth" required>
          <div className="relative">
            <Calendar size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              type="date"
              value={data.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
        <Field label="Personal Number / ID" hint="National ID or passport number">
          <div className="relative">
            <CreditCard size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <Input
              placeholder="1234567890123"
              value={data.personalNumber}
              onChange={(e) => onChange("personalNumber", e.target.value)}
              className="pl-9"
            />
          </div>
        </Field>
      </div>

      {/* Address */}
      <Field label="Home Address">
        <div className="relative">
          <MapPin size={14} className="absolute left-3 top-3 text-slate-400 pointer-events-none" />
          <Textarea
            placeholder="Street, City, Postal Code, Country"
            rows={2}
            value={data.address}
            onChange={(e) => onChange("address", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>

      {/* Emergency contact */}
      <Field label="Emergency Contact" hint="Name and phone number of the person to contact in an emergency">
        <div className="relative">
          <Heart size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <Input
            placeholder="Jane Doe — +381 60 111 2222"
            value={data.emergencyContact}
            onChange={(e) => onChange("emergencyContact", e.target.value)}
            className="pl-9"
          />
        </div>
      </Field>
    </div>
  );
}
