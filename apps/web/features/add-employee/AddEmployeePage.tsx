"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, UserPlus, CheckCircle2 } from "lucide-react";
import { INITIAL_FORM, STEPS, EmployeeForm, PersonalInfo, JobInfo, CompensationInfo } from "./components/types";
import { StepIndicator }    from "./components/StepIndicator";
import { StepPersonal }     from "./components/StepPersonal";
import { StepJob }          from "./components/StepJob";
import { StepCompensation } from "./components/StepCompensation";
import { StepReview }       from "./components/StepReview";
import { postEmployee } from "./api";

// Minimal validation per step
function isStepValid(step: number, form: EmployeeForm): boolean {
  if (step === 1) {
    const { firstName, lastName, email, dateOfBirth } = form.personal;
    return !!(firstName.trim() && lastName.trim() && email.trim() && dateOfBirth);
  }
  if (step === 2) {
    const { jobTitle, department, startDate } = form.job;
    return !!(jobTitle.trim() && department && startDate);
  }
  if (step === 3) {
    const { salaryAmount } = form.compensation;
    return !!salaryAmount;
  }
  return true;
}

export function AddEmployeePage() {
  const [step, setStep]     = useState(1);
  const [form, setForm]     = useState<EmployeeForm>(INITIAL_FORM);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = STEPS.length;
  const isLast     = step === totalSteps;
  const canNext    = isStepValid(step, form);

  function patchPersonal<K extends keyof PersonalInfo>(key: K, value: PersonalInfo[K]) {
    setForm((f) => ({ ...f, personal: { ...f.personal, [key]: value } }));
  }
  function patchJob<K extends keyof JobInfo>(key: K, value: JobInfo[K]) {
    setForm((f) => ({ ...f, job: { ...f.job, [key]: value } }));
  }
  function patchCompensation<K extends keyof CompensationInfo>(key: K, value: CompensationInfo[K]) {
    setForm((f) => ({ ...f, compensation: { ...f.compensation, [key]: value } }));
  }

  const handleNext = () => {
    if (step <= totalSteps) setStep((s) => s + 1);
  };
  const handleBack = () => setStep((s) => Math.max(1, s - 1));
  const handleSubmit = () => {
    console.log("Submitting employee:", form);
    postEmployee(form)
    setSubmitted(true);
  };

  // ── Success screen ─────────────────────────────────────────────────────────
  if (submitted) {
    const fullName = `${form.personal.firstName} ${form.personal.lastName}`;
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6" style={{ fontFamily: "'DM Sans', sans-serif" }}>
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-full bg-green-50 flex items-center justify-center mx-auto">
            <CheckCircle2 size={32} className="text-green-500" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Employee Created!</h2>
            <p className="text-slate-500 text-sm mt-1">
              <span className="font-semibold text-slate-800">{fullName}</span> has been successfully added.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
            <div className="flex justify-between text-xs"><span className="text-slate-400">Role</span><span className="font-semibold text-slate-700">{form.job.jobTitle}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Department</span><span className="font-semibold text-slate-700">{form.job.department}</span></div>
            <div className="flex justify-between text-xs"><span className="text-slate-400">Start Date</span><span className="font-semibold text-slate-700">{form.job.startDate}</span></div>
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => { setForm(INITIAL_FORM); setStep(1); setSubmitted(false); }}
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
    <div className="min-h-screen bg-slate-50" style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <UserPlus size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add New Employee</h1>
            <p className="text-sm text-slate-500">Step {step} of {totalSteps}</p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-6">
          <StepIndicator current={step} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {step === 1 && <StepPersonal     data={form.personal}     onChange={patchPersonal}     />}
          {step === 2 && <StepJob          data={form.job}          onChange={patchJob}          />}
          {step === 3 && <StepCompensation data={form.compensation} onChange={patchCompensation} />}
          {step === 4 && <StepReview       form={form}                                           />}
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
              onClick={isLast ? undefined : handleNext}
              disabled={!canNext && step !== totalSteps}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLast ? (
                <span onClick={handleNext}>Review <ArrowRight size={15} /></span>
              ) : (
                <>Continue <ArrowRight size={15} /></>
              )}
            </button>
          ) : (
            <button
              onClick={handleSubmit}
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
