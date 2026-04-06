"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Package, CheckCircle2 } from "lucide-react";
import { makeRequest } from "../../../lib/axios";
import { StepIndicator } from "./steps/StepIndicator";
import { StepBasic } from "./steps/StepBasic";
import { StepPurchase } from "./steps/StepPurchase";
import { StepReview } from "./steps/StepReview";
import { StepAssignment } from "./steps/StepAssignment";
import {
  AssignmentInfo,
  BasicInfo,
  EquipmentForm,
  INITIAL_EQUIPMENT_FORM,
  INITIAL_FORM,
  PurchaseInfo,
  STEPS,
} from "@repo/types";
import { CATEGORY_ICONS } from "./types";

function isStepValid(step: number, form: EquipmentForm): boolean {
  if (step === 1) {
    const { name, category, brand, model } = form.basic;
    return !!(name.trim() && category && brand.trim() && model.trim());
  }
  if (step === 2) {
    return !!(form.purchase.condition && form.purchase.status);
  }
  if (step === 3) {
    const { assignedTo, location } = form.assignment;
    if (form.purchase.status === "Assigned" && !assignedTo) return false;
    return !!location;
  }
  return true;
}

export function AddEquipmentPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<EquipmentForm>(INITIAL_EQUIPMENT_FORM);
  const [submitted, setSubmitted] = useState(false);

  const totalSteps = STEPS.length;
  const isLast = step === totalSteps;
  const isReview = step === totalSteps + 1;
  const canNext = isStepValid(step, form);

  async function onSubmit() {
    try {
      setSubmitted(true);

      const data = await makeRequest({
        url: "/equipments",
        method: "POST",
        data: form,
      });

      console.log("Equipment created:", data);
    } catch (error) {
      console.error("Error submitting equipment:", error);
    }
  }

  function patchBasic<K extends keyof BasicInfo>(key: K, value: BasicInfo[K]) {
    setForm((f) => ({ ...f, basic: { ...f.basic, [key]: value } }));
  }
  function patchPurchase<K extends keyof PurchaseInfo>(
    key: K,
    value: PurchaseInfo[K],
  ) {
    setForm((f) => ({ ...f, purchase: { ...f.purchase, [key]: value } }));
  }
  function patchAssignment<K extends keyof AssignmentInfo>(
    key: K,
    value: AssignmentInfo[K],
  ) {
    setForm((f) => ({ ...f, assignment: { ...f.assignment, [key]: value } }));
  }

  if (submitted) {
    const icon = form.basic.category
      ? CATEGORY_ICONS[form.basic.category]
      : "📦";
    return (
      <div
        className="min-h-screen bg-slate-50 flex items-center justify-center p-6"
      >
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xl p-12 max-w-md w-full text-center space-y-5">
          <div className="w-16 h-16 rounded-2xl bg-green-50 flex items-center justify-center mx-auto text-3xl">
            {icon}
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">
              Equipment Added!
            </h2>
            <p className="text-slate-500 text-sm mt-1">
              <span className="font-semibold text-slate-800">
                {form.basic.name}
              </span>{" "}
              has been saved to your inventory.
            </p>
          </div>
          <div className="bg-slate-50 rounded-2xl p-4 text-left space-y-2">
            {[
              { label: "Asset Tag", value: form.basic.assetTag || "—" },
              { label: "Status", value: form.purchase.status },
              {
                label: "Assigned To",
                value: form.assignment.assignedTo || "Unassigned",
              },
              { label: "Location", value: form.assignment.location },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between text-xs">
                <span className="text-slate-400">{label}</span>
                <span className="font-semibold text-slate-700">{value}</span>
              </div>
            ))}
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => {
                setForm(INITIAL_EQUIPMENT_FORM);
                setStep(1);
                setSubmitted(false);
              }}
              className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Add Another
            </button>
            <button className="flex-1 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors">
              View Inventory
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-slate-50"
    >
      <div className="max-w-3xl mx-auto px-6 py-8 space-y-8">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center">
            <Package size={18} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Add Equipment</h1>
            <p className="text-sm text-slate-500">
              {isReview ? "Review & confirm" : `Step ${step} of ${totalSteps}`}
            </p>
          </div>
          {form.basic.name && (
            <div className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span className="text-base">
                {form.basic.category
                  ? CATEGORY_ICONS[form.basic.category]
                  : "📦"}
              </span>
              <span className="text-xs font-semibold text-slate-700 max-w-32 truncate">
                {form.basic.name}
              </span>
            </div>
          )}
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm px-8 py-6">
          <StepIndicator current={isReview ? totalSteps + 1 : step} />
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-8">
          {step === 1 && !isReview && (
            <StepBasic data={form.basic} onChange={patchBasic} />
          )}
          {step === 2 && !isReview && (
            <StepPurchase data={form.purchase} onChange={patchPurchase} />
          )}
          {step === 3 && !isReview && (
            <StepAssignment
              data={form.assignment}
              onChange={patchAssignment}
              equipmentStatus={form.purchase.status}
            />
          )}
          {isReview && <StepReview form={form} />}
        </div>

        <div className="flex items-center justify-between">
          <button
            onClick={() =>
              isReview
                ? setStep(totalSteps)
                : setStep((s) => Math.max(1, s - 1))
            }
            disabled={step === 1 && !isReview}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
          >
            <ArrowLeft size={15} /> Back
          </button>

          <div className="flex items-center gap-1.5">
            {Array.from({ length: totalSteps + 1 }).map((_, i) => {
              const dotStep = i + 1;
              const current = isReview ? totalSteps + 1 : step;
              return (
                <div
                  key={i}
                  className={`rounded-full transition-all duration-300 ${
                    dotStep === current
                      ? "w-5 h-2 bg-slate-900"
                      : dotStep < current
                        ? "w-2 h-2 bg-indigo-400"
                        : "w-2 h-2 bg-slate-200"
                  }`}
                />
              );
            })}
          </div>

          {!isReview ? (
            <button
              onClick={() => {
                if (isLast) {
                  setStep(totalSteps + 1);
                } else {
                  setStep((s) => s + 1);
                }
              }}
              disabled={!canNext}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-700 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLast ? "Review" : "Continue"} <ArrowRight size={15} />
            </button>
          ) : (
            <button
              onClick={() => onSubmit()}
              className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-bold hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200"
            >
              <CheckCircle2 size={15} /> Save Equipment
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
