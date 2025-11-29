"use client";
import React, { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Calendar,
  MessageCircle,
  Star,
} from "lucide-react";
import ProfileHeader from "./profile-header";
import ActivityContent from "./activity/activity-content";
import { activityData } from "../mock";
import TeamTab from "./team-tab";
import { DocumentsTab } from "./documents/document-tab";
import TimeOffTab from "./time-off/time-off-tab";

const UserProfile = () => {
  const [activeTab, setActiveTab] = useState("Activity");

  const tabs = ["Activity", "Team", "Time off", "Documents", "Reviews"];

  // Render content based on active tab
  const renderTabContent = () => {
    switch (activeTab) {
      case "Activity":
        return <ActivityContent activityData={activityData} />;
      case "Team":
        return <TeamTab />;
      case "Documents":
        return <DocumentsTab />;
      case "Time off":
        return <TimeOffTab />;
      default:
        return <ActivityContent activityData={activityData} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - User Info */}
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <ProfileHeader />

              {/* Action Buttons */}
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Phone className="w-4 h-4" />
                  <span className="text-sm">Phone Call</span>
                </button>
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Mail className="w-4 h-4" />
                  <span className="text-sm">Send Email</span>
                </button>
                <button className="flex items-center justify-center space-x-1 px-3 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50">
                  <MessageCircle className="w-4 h-4" />
                  <span className="text-sm">Send SMS</span>
                </button>
              </div>

              {/* Profile Details */}
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Mailing Address</p>
                    <p className="text-sm font-medium">134 Baker Street</p>
                    <p className="text-sm font-medium">San Diego, CA 92093</p>
                    <p className="text-sm font-medium">USA</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-blue-600">
                      Work: denis.mendoza@email.com
                    </p>
                    <p className="text-sm font-medium text-blue-600">
                      Home: denis.mendoza@email.com
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-sm font-medium">
                      Mobile: +(555) 203 923
                    </p>
                    <p className="text-sm font-medium">Work: +(555) 323 232</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Contact Stage</p>
                    <p className="text-sm font-medium">Captured</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Birthday</p>
                    <p className="text-sm font-medium">19 Oct 1982</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Registered</p>
                      <p className="text-sm font-medium">17 Aug 2019</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Last Active</p>
                      <p className="text-sm font-medium">1 month ago</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Last Edited</p>
                      <p className="text-sm font-medium">4 months ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content Area */}
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm">
              {/* Tabs */}
              <div className="border-b">
                <div className="flex space-x-8 px-6 overflow-x-auto">
                  {tabs.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`py-4 px-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                        activeTab === tab
                          ? "border-blue-500 text-blue-600"
                          : "border-transparent text-gray-500 hover:text-gray-700"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Tab Content */}
              <div className="">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
