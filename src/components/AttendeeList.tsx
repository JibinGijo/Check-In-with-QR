import React, { useState } from 'react';
import { useAttendees } from '../context/AttendeeContext';
import { Attendee } from '../types';
import { exportToCSV } from '../utils/csvParser';
import { sendQRCodeEmail } from '../utils/emailService';
import { Search, Download, Mail, CheckCircle, XCircle, Clock } from 'lucide-react';
import Button from './common/Button';
import Card from './common/Card';
import { format } from 'date-fns';

const AttendeeList: React.FC = () => {
  const { attendees, markEmailSent } = useAttendees();
  const [searchTerm, setSearchTerm] = useState('');
  const [sendingEmail, setSendingEmail] = useState<string | null>(null);
  
  const filteredAttendees = attendees.filter(
    (attendee) =>
      attendee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (attendee.organization &&
        attendee.organization.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleExport = () => {
    const exportData = attendees.map((attendee) => ({
      Name: attendee.name,
      Email: attendee.email,
      Organization: attendee.organization || '',
      'Check-in Status': attendee.checkedIn ? 'Checked In' : 'Not Checked In',
      'Check-in Time': attendee.checkInTime
        ? new Date(attendee.checkInTime).toLocaleString()
        : '',
      'Email Sent': attendee.emailSent ? 'Yes' : 'No',
    }));

    exportToCSV(exportData, `attendees-${new Date().toISOString().slice(0, 10)}.csv`);
  };

  const handleSendEmail = async (attendee: Attendee) => {
    setSendingEmail(attendee.id);
    try {
      const success = await sendQRCodeEmail(attendee);
      if (success) {
        markEmailSent(attendee.id);
      }
    } catch (error) {
      console.error('Failed to send email:', error);
    } finally {
      setSendingEmail(null);
    }
  };

  return (
    <Card title="Attendee List" className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div className="relative w-full sm:w-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search attendees..."
            className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full sm:w-64 focus:ring-blue-500 focus:border-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          variant="outline"
          onClick={handleExport}
          icon={<Download size={16} />}
          disabled={attendees.length === 0}
        >
          Export Data
        </Button>
      </div>

      {attendees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No attendees yet. Upload a CSV file to get started.
        </div>
      ) : filteredAttendees.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No attendees match your search criteria.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Organization
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAttendees.map((attendee) => (
                <tr key={attendee.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {attendee.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendee.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {attendee.organization || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      {attendee.checkedIn ? (
                        <>
                          <CheckCircle size={16} className="text-green-500 mr-2" />
                          <span>
                            Checked in{' '}
                            {attendee.checkInTime &&
                              format(new Date(attendee.checkInTime), 'MMM d, h:mm a')}
                          </span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} className="text-gray-400 mr-2" />
                          <span>Not checked in</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <Button
                      variant={attendee.emailSent ? 'secondary' : 'primary'}
                      size="sm"
                      icon={attendee.emailSent ? <CheckCircle size={16} /> : <Mail size={16} />}
                      isLoading={sendingEmail === attendee.id}
                      onClick={() => handleSendEmail(attendee)}
                      disabled={attendee.emailSent}
                      className="text-xs px-2 py-1"
                    >
                      {attendee.emailSent ? 'Sent' : 'Send QR'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Card>
  );
};

export default AttendeeList;