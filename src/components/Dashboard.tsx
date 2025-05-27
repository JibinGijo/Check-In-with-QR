import React from 'react';
import { useAttendees } from '../context/AttendeeContext';
import Card from './common/Card';
import { Users, UserCheck, Mail, Clock } from 'lucide-react';

const DashboardCard: React.FC<{
  title: string;
  value: number | string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, icon, color }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden border-t-4 ${color}`}>
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">{title}</dt>
              <dd>
                <div className="text-3xl font-semibold text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const { attendees, getStats } = useAttendees();
  const stats = getStats();
  
  // Calculate check-in rate
  const checkInRate = stats.total > 0 ? Math.round((stats.checkedIn / stats.total) * 100) : 0;
  
  // Calculate email sent rate
  const emailRate = stats.total > 0 ? Math.round((stats.emailsSent / stats.total) * 100) : 0;
  
  // Get checked in and not checked in lists for the charts
  const checkedInList = attendees.filter((a) => a.checkedIn);
  const notCheckedInList = attendees.filter((a) => !a.checkedIn);

  return (
    <div className="max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Event Dashboard</h2>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          title="Total Attendees"
          value={stats.total}
          icon={<Users className="h-6 w-6 text-blue-600" />}
          color="border-blue-500"
        />
        <DashboardCard
          title="Checked In"
          value={`${stats.checkedIn} (${checkInRate}%)`}
          icon={<UserCheck className="h-6 w-6 text-green-600" />}
          color="border-green-500"
        />
        <DashboardCard
          title="QR Codes Sent"
          value={`${stats.emailsSent} (${emailRate}%)`}
          icon={<Mail className="h-6 w-6 text-purple-600" />}
          color="border-purple-500"
        />
        <DashboardCard
          title="Not Checked In"
          value={stats.total - stats.checkedIn}
          icon={<Clock className="h-6 w-6 text-amber-600" />}
          color="border-amber-500"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Recent Check-ins" className="h-full">
          {checkedInList.length === 0 ? (
            <div className="py-4 text-center text-gray-500">No check-ins yet</div>
          ) : (
            <div className="overflow-y-auto max-h-80">
              <ul className="divide-y divide-gray-200">
                {checkedInList.slice(0, 5).map((attendee) => (
                  <li key={attendee.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <span className="text-blue-600 font-medium">
                          {attendee.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attendee.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{attendee.email}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <p className="text-sm text-gray-500">
                          {attendee.checkInTime
                            ? new Date(attendee.checkInTime).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit',
                              })
                            : ''}
                        </p>
                        <p className="text-xs text-gray-400">
                          {attendee.checkInTime
                            ? new Date(attendee.checkInTime).toLocaleDateString()
                            : ''}
                        </p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {checkedInList.length > 5 && (
                <div className="pt-2 pb-1 text-center text-sm text-gray-500">
                  + {checkedInList.length - 5} more check-ins
                </div>
              )}
            </div>
          )}
        </Card>
        
        <Card title="Pending Check-ins" className="h-full">
          {notCheckedInList.length === 0 ? (
            <div className="py-4 text-center text-gray-500">
              All attendees have checked in!
            </div>
          ) : (
            <div className="overflow-y-auto max-h-80">
              <ul className="divide-y divide-gray-200">
                {notCheckedInList.slice(0, 5).map((attendee) => (
                  <li key={attendee.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                        <span className="text-gray-600 font-medium">
                          {attendee.name.substring(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {attendee.name}
                        </p>
                        <p className="text-sm text-gray-500 truncate">{attendee.email}</p>
                      </div>
                      <div className="flex-shrink-0">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            attendee.emailSent
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {attendee.emailSent ? 'QR Sent' : 'QR Not Sent'}
                        </span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {notCheckedInList.length > 5 && (
                <div className="pt-2 pb-1 text-center text-sm text-gray-500">
                  + {notCheckedInList.length - 5} more pending
                </div>
              )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;