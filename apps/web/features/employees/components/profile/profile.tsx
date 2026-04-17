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
import TeamTab from "./team-tab";
import { DocumentsTab } from "./documents/document-tab";
import TimeOffTab from "./time-off/time-off-tab";
import { formatDate } from "@/lib/utils";
import { useEmployee } from "../../hooks/queries";
import { useAuth } from "../../../auth/hooks/useAuth";
import { getVisibleTabs } from "./config/tabs.config";
import { Role } from "../../../../config/rbac";
import ReviewsTab from "../../../review/components/ReviewsTab";

const UserProfile = ({ id }: { id: string }) => {
  const { data: employeeData, isLoading, error } = useEmployee(id);
  const [activeTab, setActiveTab] = useState("Activity");
  const { user } = useAuth();

  const visibleTabs = getVisibleTabs(user?.role as Role);

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading profile</div>;
  if (!employeeData) return <div>No employee data found</div>;

  const { personal, job, compensation, timeOffBalance, leaveRequests } = employeeData;

  const renderTabContent = () => {
    switch (activeTab) {
      case "Activity":
        return <ActivityContent activityData={[]} />;
      case "Team":
        return <TeamTab employeeId={id} />;
      case "Documents":
        return <DocumentsTab employeeId={id} />;
      case "Time off":
        return <TimeOffTab timeOffBalance={timeOffBalance} leaveRequests={leaveRequests} />;
      case "Reviews":
          return <ReviewsTab employeeId={id} />
      default:
        return <ActivityContent activityData={[]} />;
    }
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg shadow-sm p-6">
              <ProfileHeader 
                name={`${personal.firstName} ${personal.lastName}`}
                jobTitle={`${job.jobTitle} - ${job.department}`}
              />

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

              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPin className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Mailing Address</p>
                    <p className="text-sm font-medium">{personal.address || 'N/A'}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Mail className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Email</p>
                    <p className="text-sm font-medium text-blue-600">
                      Work: {personal.email}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3">
                  <Phone className="w-4 h-4 text-gray-400 mt-1" />
                  <div>
                    <p className="text-sm text-gray-600">Phone Number</p>
                    <p className="text-sm font-medium">
                      Mobile: {personal.phone || 'N/A'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Star className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Employment Type</p>
                    <p className="text-sm font-medium">{job.employmentType}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <div>
                    <p className="text-sm text-gray-600">Birthday</p>
                    <p className="text-sm font-medium">
                      {formatDate(personal.dateOfBirth)}
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <p className="text-xs text-gray-600">Registered</p>
                      <p className="text-sm font-medium">
                        {formatDate(personal.createdAt)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-600">Start Date</p>
                      <p className="text-sm font-medium">
                        {formatDate(job.startDate)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg shadow-sm">
              <div className="border-b">
                <div className="flex space-x-8 px-6 overflow-x-auto">
                  {visibleTabs.map((tab) => (
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

              <div className="">{renderTabContent()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
