"use client";

import { useState } from "react";
import {
  Mail,
  Send,
  Eye,
  Edit3,
  Copy,
  Save,
  X,
  Plus,
  ChevronRight,
  User,
  Loader2,
  Trash2,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Template type definition
interface EmailTemplate {
  id: string;
  label: string;
  subject: string;
  body: string;
  fromName?: string;
  fromEmail?: string;
  description?: string;
}

// Default templates data
const defaultTemplates: EmailTemplate[] = [
  {
    id: "welcome",
    label: "Welcome Email",
    subject: "Welcome to {{company_name}}, {{name}}!",
    body: `Dear {{name}},

We're excited to welcome you to the team! Your start date is {{start_date}}.

Here are your next steps:
1. Complete your onboarding checklist
2. Set up your equipment
3. Meet your manager on your first day

If you have any questions, feel free to reach out.

Best regards,
{{manager_name}}
HR Team`,
    fromName: "HR Department",
    fromEmail: "hr@company.com",
    description: "Sent to new hires after acceptance.",
  },
  {
    id: "offer",
    label: "Offer Email",
    subject: "Job Offer: {{position}} at {{company_name}}",
    body: `Dear {{name}},

We are pleased to offer you the position of {{position}} at {{company_name}}.

**Offer Details:**
- Start Date: {{start_date}}
- Salary: {{salary}}
- Location: {{location}}

Please review the attached offer letter and let us know by {{expiry_date}}.

We look forward to having you on board!

Best regards,
{{hiring_manager}}`,
    fromName: "Talent Acquisition",
    fromEmail: "talent@company.com",
    description: "Sent when extending a job offer.",
  },
  {
    id: "invoice",
    label: "Invoice Email",
    subject: "Invoice #{{invoice_number}} from {{company_name}}",
    body: `Dear {{customer_name}},

Please find attached invoice #{{invoice_number}} for the amount of {{amount}} due by {{due_date}}.

**Invoice Summary:**
- Service: {{service_description}}
- Period: {{period}}

You can make the payment via bank transfer using the details below.

Thank you for your business.

Regards,
Billing Team`,
    fromName: "Billing",
    fromEmail: "billing@company.com",
    description: "Sent to clients with invoice attachments.",
  },
  {
    id: "leave",
    label: "Leave Approval",
    subject: "Leave Request Approved: {{leave_type}}",
    body: `Dear {{employee_name}},

Your leave request from {{start_date}} to {{end_date}} has been **approved**.

**Leave Details:**
- Type: {{leave_type}}
- Duration: {{duration}} day(s)
- Balance remaining: {{remaining_balance}} days

Enjoy your time off. Please coordinate with your team for coverage.

Regards,
{{manager_name}}
HR System`,
    fromName: "HR Portal",
    fromEmail: "hr@company.com",
    description: "Automatic approval notification for time off.",
  },
];

const highlightPlaceholders = (text: string) => {
  const parts = text.split(/(\{\{.*?\}\})/g);
  return parts.map((part, i) => {
    if (part.match(/\{\{.*?\}\}/)) {
      return (
        <span
          key={i}
          className="bg-indigo-100 text-indigo-700 px-1.5 py-0.5 rounded-md font-mono text-[11px] font-semibold border border-indigo-200"
        >
          {part}
        </span>
      );
    }
    return part;
  });
};

const TemplateEditor = ({
  template,
  onUpdate,
}: {
  template: EmailTemplate;
  onUpdate: (updated: EmailTemplate) => void;
}) => {
  const [subject, setSubject] = useState(template.subject);
  const [body, setBody] = useState(template.body);
  const [previewMode, setPreviewMode] = useState(false);

  // Sync state if template changes from outside
  if (subject !== template.subject && !previewMode) {
      setTimeout(() => {
          setSubject(template.subject);
          setBody(template.body);
      }, 0);
  }

  const handleSave = () => {
    onUpdate({ ...template, subject, body });
  };

  const handleReset = () => {
    const original = defaultTemplates.find((t) => t.id === template.id);
    if (original) {
      setSubject(original.subject);
      setBody(original.body);
      onUpdate(original);
    }
  };

  const insertPlaceholder = (ph: string) => {
      setBody(prev => prev + ` {{${ph}}}`);
  };

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div className="bg-slate-100 p-1 rounded-xl flex gap-1">
          <button
            onClick={() => setPreviewMode(false)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              !previewMode
                ? "bg-white text-indigo-600 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Edit3 size={16} />
            Edit content
          </button>
          <button
            onClick={() => setPreviewMode(true)}
            className={`px-4 py-2 text-sm rounded-lg transition-all duration-200 flex items-center gap-2 ${
              previewMode
                ? "bg-white text-indigo-600 shadow-sm font-semibold"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <Eye size={16} />
            Preview
          </button>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleReset}
            className="px-4 py-2 text-sm font-medium border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition-colors"
          >
            Reset to default
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all shadow-sm flex items-center gap-2 active:scale-95"
          >
            <Save size={16} />
            Save changes
          </button>
        </div>
      </div>

      <AnimatePresence mode="wait">
        {!previewMode ? (
          <motion.div
            key="edit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1">
                Subject Line
              </label>
              <input
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Enter subject line..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-medium"
              />
            </div>
            
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 px-1 flex justify-between">
                <span>Email Content</span>
                <span className="text-[10px] text-slate-400 font-normal">Supports plain text & placeholders</span>
              </label>
              <textarea
                value={body}
                onChange={(e) => setBody(e.target.value)}
                rows={12}
                placeholder="Write your email template here..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500/50 transition-all text-sm font-mono leading-relaxed resize-none"
              />
            </div>

            <div className="bg-indigo-50 rounded-2xl p-4 border border-indigo-100/50">
              <div className="flex items-center gap-2 text-indigo-700 mb-3 px-1">
                <Plus size={14} className="stroke-[3px]" />
                <span className="text-xs font-bold uppercase tracking-wider">Quick Insert Variables</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {["name", "company_name", "start_date", "position", "salary", "manager_name"].map((v) => (
                  <button
                    key={v}
                    onClick={() => insertPlaceholder(v)}
                    className="px-3 py-1.5 bg-white border border-indigo-200 text-indigo-600 rounded-lg text-xs font-semibold hover:bg-indigo-600 hover:text-white hover:border-indigo-600 transition-all active:scale-95 shadow-sm"
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="preview"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="border border-slate-200 rounded-2xl overflow-hidden bg-white shadow-xl shadow-slate-200/50"
          >
            {/* Email Header Simulation */}
            <div className="bg-slate-50/80 backdrop-blur-sm px-6 py-4 border-b border-slate-200 flex flex-col gap-2">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                  <User size={16} />
                </div>
                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-slate-900">{template.fromName}</span>
                    <span className="text-slate-400 text-xs">at</span>
                    <span className="text-slate-500 font-medium tracking-tight">System Notification</span>
                  </div>
                  <div className="text-slate-400 text-[11px] leading-tight">&lt;{template.fromEmail}&gt;</div>
                </div>
              </div>
              <div className="h-px bg-slate-200/50 w-full my-1"></div>
              <div className="flex items-start gap-2">
                <span className="text-[px] font-bold text-slate-400 uppercase tracking-widest mt-[4px] shrink-0">Subj:</span>
                <span className="text-sm font-semibold text-slate-800 leading-snug">{subject || "(No subject)"}</span>
              </div>
            </div>

            {/* Email Canvas */}
            <div className="p-8 max-w-full">
              <div className="text-slate-700 text-[15px] leading-relaxed font-normal">
                {body ? (
                    body.split("\n").map((line, i) => (
                      <p key={i} className={line.trim() === "" ? "h-4" : "mb-4"}>
                        {highlightPlaceholders(line)}
                      </p>
                    ))
                ) : (
                    <p className="text-slate-400 italic">No content provided yet.</p>
                )}
              </div>
            </div>

            {/* Footer Legend */}
            <div className="bg-slate-50/50 px-6 py-3 border-t border-slate-200 flex items-center gap-4 overflow-x-auto scrollbar-hide">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest shrink-0">Active tags:</span>
              <div className="flex gap-1.5 shrink-0">
                {Array.from(body.matchAll(/\{\{(\w+)\}\}/g)).length > 0 ? (
                    Array.from(new Set(Array.from(body.matchAll(/\{\{(\w+)\}\}/g)).map(m => m[1]))).map((tag, idx) => (
                    <span key={idx} className="bg-white border border-slate-200 text-slate-600 px-2 py-0.5 rounded-full text-[10px] font-bold shadow-sm">
                        {tag}
                    </span>
                    ))
                ) : (
                    <span className="text-[10px] text-slate-400">None detected</span>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Main Component
export function EmailTemplates({
  activeTemplate,
  setActiveTemplate,
}: {
  activeTemplate: string;
  setActiveTemplate: (id: string) => void;
}) {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates);
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");
  const [isTestSending, setIsTestSending] = useState(false);

  const currentTemplate = templates.find((t) => t.id === activeTemplate) || templates[0];

  const updateTemplate = (updated: EmailTemplate) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === updated.id ? updated : t))
    );
  };

  const addTemplate = (name?: string, baseTemplate?: EmailTemplate) => {
    const templateName = name || newTemplateName;
    if (!templateName.trim()) return;
    
    const newId = `${templateName.toLowerCase().replace(/\s+/g, "-")}-${Date.now().toString().slice(-4)}`;
    
    const newTemplate: EmailTemplate = baseTemplate 
      ? { ...baseTemplate, id: newId, label: name ? name : `Copy of ${baseTemplate.label}`, description: 'Custom template' }
      : {
          id: newId,
          label: templateName,
          subject: "New Email Template",
          body: "Dear {{name}},\n\nThis is a new template. Customize it with your content.\n\nBest regards,\n{{sender}}",
          fromName: "HR Team",
          fromEmail: "hr@company.com",
          description: "Custom template",
        };
        
    setTemplates([...templates, newTemplate]);
    setActiveTemplate(newId);
    setShowNewModal(false);
    setNewTemplateName("");
  };

  const handleDuplicate = () => {
      addTemplate(`Copy of ${currentTemplate?.label}`, currentTemplate);
  };

  const handleTestSend = () => {
    setIsTestSending(true);
    setTimeout(() => {
        setIsTestSending(false);
        alert(`Test email for "${currentTemplate?.label}" sent to your workspace email!`);
    }, 1500);
  };

  const handleDelete = (id: string) => {
      if (templates.length <= 1) {
          alert("At least one template must remain.");
          return;
      }
      if (confirm(`Are you sure you want to delete "${templates.find(t => t.id === id)?.label}"?`)) {
          const newTemps = templates.filter(t => t.id !== id);
          setTemplates(newTemps);
          if (activeTemplate === id) {
              setActiveTemplate(newTemps[0].id);
          }
      }
  };

  return (
    <div className="flex flex-col xl:flex-row gap-8">
      {/* Sidebar - Template List */}
      <div className="xl:w-70 space-y-4">
        <div className="flex flex-col bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div>
                <h3 className="font-bold text-slate-800 flex items-center gap-2">
                    <Mail size={18} className="text-indigo-600" />
                    Templates
                </h3>
                <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Automated Notifications</p>
            </div>
            <button 
                onClick={() => setShowNewModal(true)}
                className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center hover:bg-slate-700 transition-all active:scale-95 shadow-lg shadow-slate-200"
            >
                <Plus size={16} />
            </button>
          </div>
          
          <div className="p-2 max-h-[500px] overflow-y-auto custom-scrollbar">
            <div className="space-y-1">
              {templates.map((t) => (
                <button
                  key={t.id}
                  onClick={() => setActiveTemplate(t.id)}
                  className={`
                    w-full text-left px-4 py-3.5 rounded-2xl text-sm transition-all relative group
                    ${
                      activeTemplate === t.id
                        ? "bg-slate-900 text-white shadow-xl shadow-slate-200 scale-[1.02] z-10"
                        : "text-slate-600 hover:bg-slate-50"
                    }
                  `}
                >
                  <div className="flex flex-col">
                    <span className="font-bold truncate">{t.label}</span>
                    {t.description && (
                      <span className={`text-[10px] mt-0.5 transition-colors line-clamp-1 ${activeTemplate === t.id ? "text-slate-400" : "text-slate-400"}`}>
                        {t.description}
                      </span>
                    )}
                  </div>
                  {activeTemplate === t.id && (
                    <motion.div 
                        layoutId="active-pill"
                        className="absolute right-4 top-1/2 -translate-y-1/2"
                    >
                        <ChevronRight size={14} className="text-slate-400" />
                    </motion.div>
                  )}
                  {activeTemplate !== t.id && (
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleDelete(t.id); }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-50 hover:text-red-500 rounded-lg transition-all"
                      >
                          <Trash2 size={14} />
                      </button>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 overflow-hidden relative">
            <Mail size={120} className="absolute -right-10 -bottom-10 text-white/10 rotate-12" />
            <SparklesIcon />
            <h4 className="font-bold relative z-10">Smart Variables</h4>
            <p className="text-xs text-indigo-100 mt-2 relative z-10 leading-relaxed">
                Connect templates with database fields to personalize every automated email.
            </p>
        </div>
      </div>

      {/* Main Editor/Preview Area */}
      <div className="flex-1 space-y-6">
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden min-h-[600px] flex flex-col">
          <div className="px-8 py-6 border-b border-slate-100 flex items-center justify-between flex-wrap gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="bg-emerald-100 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-tighter">Active System</span>
                <h2 className="text-xl font-bold text-slate-800">
                    {currentTemplate?.label}
                </h2>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {currentTemplate?.description || "Fully customizable automated responses"}
              </p>
            </div>
            
            <div className="flex gap-3">
              <button 
                onClick={handleDuplicate}
                className="px-5 py-2.5 text-sm font-bold bg-white border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50 transition-all flex items-center gap-2 active:scale-95 shadow-sm"
              >
                <Copy size={16} />
                Duplicate
              </button>
              <button 
                onClick={handleTestSend}
                disabled={isTestSending}
                className="px-5 py-2.5 text-sm font-bold bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-all flex items-center gap-2 active:scale-95 shadow-lg shadow-emerald-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isTestSending ? (
                    <><Loader2 size={16} className="animate-spin" /> Sending...</>
                ) : (
                    <><Send size={16} /> Test Send</>
                )}
              </button>
            </div>
          </div>

          <div className="p-8 flex-1">
            <TemplateEditor template={currentTemplate} onUpdate={updateTemplate} />
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showNewModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowNewModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[32px] shadow-2xl max-w-md w-full p-8 relative z-10 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                    <Mail size={24} />
                </div>
                <button
                  onClick={() => setShowNewModal(false)}
                  className="w-10 h-10 rounded-full hover:bg-slate-100 flex items-center justify-center transition-colors"
                >
                  <X size={20} className="text-slate-400" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                   <h3 className="text-2xl font-bold text-slate-800 mb-2">Create template</h3>
                   <p className="text-slate-500 text-sm">Start building a new automated email for your organization.</p>
                </div>

                <div className="space-y-2">
                  <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                    Template name
                  </label>
                  <input
                    type="text"
                    value={newTemplateName}
                    onChange={(e) => setNewTemplateName(e.target.value)}
                    placeholder="e.g., Performance Review"
                    className="w-full px-4 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all text-sm font-semibold"
                    autoFocus
                  />
                </div>

                <div className="flex gap-4 pt-2">
                  <button
                    onClick={() => setShowNewModal(false)}
                    className="flex-1 px-6 py-4 border border-slate-200 rounded-2xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all active:scale-95"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => addTemplate()}
                    disabled={!newTemplateName.trim()}
                    className="flex-1 px-6 py-4 bg-slate-900 text-white rounded-2xl text-sm font-bold border-b-4 border-slate-700 hover:translate-y-[1px] hover:border-b-2 active:translate-y-[4px] active:border-b-0 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Create now
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SparklesIcon() {
    return (
        <div className="w-8 h-8 rounded-xl bg-white/20 flex items-center justify-center mb-4 backdrop-blur-sm">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-white">
                <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                <path d="M5 3v4" />
                <path d="M19 17v4" />
                <path d="M3 5h4" />
                <path d="M17 19h4" />
            </svg>
        </div>
    );
}