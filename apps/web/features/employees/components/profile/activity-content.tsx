import React from 'react'
import { Activity } from '../mock'

interface ActivityProps {
  activityData: Activity[];
}

const ActivityContent = ({ activityData } : ActivityProps) => {
  return (
    <div className="p-6">
                <div className="space-y-4">
                  {activityData.map((activity) => (
                    <div key={activity.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            <h3 className="text-sm font-medium text-gray-900">{activity.title}</h3>
                            <span className="text-xs text-gray-500">{activity.time}</span>
                          </div>
                          
                          {activity.subtitle && (
                            <p className="text-sm text-blue-600 mb-2">{activity.subtitle}</p>
                          )}
                          
                          {activity.description && (
                            <p className="text-sm text-gray-600 mb-2">{activity.description}</p>
                          )}
                          
                          {activity.status && (
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="text-sm text-gray-600">status changed to</span>
                              <span className={`px-2 py-1 text-xs font-medium rounded ${
                                activity.status === 'Done' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {activity.status}
                              </span>
                            </div>
                          )}
                          
                          {activity.price && (
                            <div className="flex items-center space-x-4 mb-2">
                              <span className="text-lg font-semibold text-gray-900">{activity.price}</span>
                              <span className="text-sm text-gray-600">{activity.duration}</span>
                              <span className="text-sm text-blue-600">{activity.link}</span>
                            </div>
                          )}
                        </div>
                        
                        {activity.avatars && (
                          <div className="flex -space-x-2">
                            {activity.avatars.map((avatar, index) => (
                              <img key={index} src={avatar} alt="" className="w-8 h-8 rounded-full border-2 border-white" />
                            ))}
                          </div>
                        )}
                        
                        {activity.image && (
                          <img src={activity.image} alt="" className="w-20 h-15 rounded-lg object-cover ml-4" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
  )
}

export default ActivityContent
