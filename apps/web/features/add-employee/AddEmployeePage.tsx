"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { StepIndicator } from "./components/StepIndicator";
import { StepPersonal } from "./components/StepPersonal";
import { StepJob } from "./components/StepJob";
import { StepCompensation } from "./components/StepCompensation";
import { StepReview } from "./components/StepReview";
import { postEmployee } from "./api";
import {
  EmployeeForm,
  EmployeeFormSchema,
  INITIAL_FORM,
  STEPS,
} from "@repo/types";

const STEP_FIELDS: Record<number, any[]> = {
  1: ["personal"],
  2: ["job"],
  3: ["compensation"],
};

export function AddEmployeePage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<EmployeeForm>({
    resolver: zodResolver(EmployeeFormSchema),
    defaultValues: INITIAL_FORM,
    mode: "onChange",
  });

  const { trigger, handleSubmit: hookSubmit, getValues, watch } = form;
  const formData = watch();

  const totalSteps = STEPS.length;
  const isLast = step === totalSteps;

  const handleNext = async () => {
    const fields = STEP_FIELDS[step];
    if (fields) {
      const isValid = await trigger(fields as any);
      if (!isValid) return;
    }
    if (step <= totalSteps) setStep((s) => s + 1);
  };

  const handleBack = () => setStep((s) => Math.max(1, s - 1));

  const onSubmit = (data: EmployeeForm) => {
    console.log("Submitting employee:", data);
    postEmployee(data);
    setSubmitted(true);
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    const fullName = `${formData.personal.firstName} ${formData.personal.lastName}`;
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
        style={{ fontFamily: "'DM Sans', sans-serif" }}
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Employee Created!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              <span className="font-semibold text-slate-800">{fullName}</span>{" "}
              has been successfully added.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Role</span>
              <span className="font-semibold text-slate-700">
                {formData.job.jobTitle}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Department</span>
              <span className="font-semibold text-slate-700">
                {formData.job.department}
              </span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Start Date</span>
              <span className="font-semibold text-slate-700">
                {formData.job.startDate}
              </span>
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                form.reset(INITIAL_FORM);
                setStep(1);
                setSubmitted(false);
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Add Another
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
              View Profile
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <UserPlus size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Add New Employee
            </h1>
            <p className="text-sm text-slate-500">
              Step {step} of {totalSteps}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-6">
          <StepIndicator current={step} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          <FormProvider {...form}>
            {step === 1 && <StepPersonal />}
            {step === 2 && <StepJob />}
            {step === 3 && <StepCompensation />}
            {step === 4 && <StepReview />}
          </FormProvider>
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={handleBack}
            disabled={step === 1}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps + 1 }).map((_, i) => (
              <div
                key={i}
                className={`rounded-full transition-all duration-300 ${
                  i + 1 === step
                    ? "w-5 h-2 bg-slate-900"
                    : i + 1 < step
                      ? "w-2 h-2 bg-indigo-400"
                      : "w-2 h-2 bg-slate-200"
                }`}
              />
            ))}
          </div>

          {step <= totalSteps ? (
            <button
              onClick={handleNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              {isLast ? (
                <>
                  Review <ArrowRight size={15} />
                </>
              ) : (
                <>
                  Continue <ArrowRight size={15} />
                </>
              )}
            </button>
          ) : (
            <button
              onClick={hookSubmit(onSubmit)}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              <CheckCircle2 size={15} /> Create Employee
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
