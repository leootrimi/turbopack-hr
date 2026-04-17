'use client'
import React, { useState } from 'react';
import { Settings, Building2, Calendar, Users, ChevronRight, Save, Mail, ClipboardList } from 'lucide-react';
import CompanySettings from './company/CompanySettings';
import TimeOffSettings from './timeoff/TimeOffSettings';
import EmployeeDefaultsSettings from './employee/EmployeeDefaultsSettings';
import { EmailTemplates } from './email-templates/EmailTemplates';
import ReviewCyclesAdmin from '../review/admin/ReviewCyclesAdmin';

export default function HRSettingsPage() {
  const [activeSection, setActiveSection] = useState('company');
  const [savedMessage, setSavedMessage] = useState('');
  const [activeTemplate, setActiveTemplate] = useState('welcome');

  const handleSave = () => {
    setSavedMessage('Settings saved successfully');
    setTimeout(() => setSavedMessage(''), 3000);
  };

  const sections = [
    { id: 'company', label: 'Company', icon: Building2 },
    { id: 'timeoff', label: 'Time Off', icon: Calendar },
    { id: 'defaults', label: 'Employee Defaults', icon: Users },
    { id: 'email', label: 'Email Templates', icon: Mail },
    { id: 'reviews', label: 'Reviews', icon: ClipboardList },
  ];

  const renderContent = () => {
    switch(activeSection) {
      case 'company':
        return <CompanySettings />;
      case 'timeoff':
        return <TimeOffSettings />;
      case 'defaults':
        return <EmployeeDefaultsSettings />;
            case 'email':
      return (
        <EmailTemplates
          activeTemplate={activeTemplate}
          setActiveTemplate={setActiveTemplate}
        />
      );
      case 'reviews':
        return <ReviewCyclesAdmin />;
      default:
        return <CompanySettings />;
    }
  };

  return (
    <div className="flex h-screen bg-slate-50">
      <div className="w-80 bg-white border-r border-slate-100 flex flex-col overflow-hidden">
        <div className="px-4 py-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-slate-900 flex items-center justify-center">
              <Settings size={16} className="text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Settings
            </span>
          </div>
        </div>

        <div className="px-3 py-4 flex flex-col gap-0.5 overflow-y-auto flex-1">
          {sections.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;

            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-150 ${
                  isActive
                    ? 'text-slate-900'
                    : 'text-slate-500 hover:text-slate-800 hover:bg-slate-100'
                }`}
              >
                <span
                  className={`flex items-center justify-center w-7 h-7 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-500'
                  }`}
                >
                  <Icon size={14} />
                </span>

                <span className="flex-1 text-left">{section.label}</span>

                {isActive && (
                  <ChevronRight size={14} className="text-slate-400" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Header */}
        <div className="bg-white border-b border-slate-100 px-8 py-6 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900">
            {sections.find((s) => s.id === activeSection)?.label}
          </h2>
          <p className="text-slate-600 text-sm mt-1">Manage your organization's settings</p>
        </div>

        <div className="flex-1 overflow-auto">
          <div className="max-w-full mx-auto p-8">
            {renderContent()}
          </div>
        </div>

        <div className="bg-white border-t border-slate-100 px-8 py-4 flex items-center justify-between">
          <div>
            {savedMessage && (
              <p className="text-sm text-green-600 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-600 rounded-full"></span>
                {savedMessage}
              </p>
            )}
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-6 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors font-semibold"
          >
            <Save className="w-4 h-4" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}