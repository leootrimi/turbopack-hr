import { Edit2, Share } from "lucide-react";
import React from "react";

const ProfileHeader = () => {
  return (
    <div className="flex items-start justify-between mb-6">
      <div className="flex items-center space-x-4">
        <div className="relative">
          <div className="w-16 h-16 bg-linear-to-t from-[#004466] to-sidebar-accent rounded-full flex items-center justify-center">
            <span className="text-white text-xl font-bold">DM</span>
          </div>
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-white rounded-full flex items-center justify-center shadow-sm">
            <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">94</span>
            </div>
          </div>
        </div>
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Denis Mendoza</h1>
          <p className="text-gray-600">Sales Manager - Techmark Inc.</p>
        </div>
      </div>
      <div className="flex space-x-2">
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Edit2 className="w-4 h-4 text-gray-600" />
        </button>
        <button className="p-2 hover:bg-gray-100 rounded-lg">
          <Share className="w-4 h-4 text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default ProfileHeader;
