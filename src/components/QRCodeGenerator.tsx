import React, { useState } from 'react';
import QRCode from 'qrcode.react';
import { useAttendees } from '../context/AttendeeContext';
import { sendBulkEmails } from '../utils/emailService';
import Button from './common/Button';
import Card from './common/Card';
import { Mail, AlertCircle } from 'lucide-react';

const QRCodeGenerator: React.FC = () => {
  const { attendees, markEmailSent } = useAttendees();
  const [selectedAttendee, setSelectedAttendee] = useState<string | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  const [result, setResult] = useState<{ success: number; failed: number } | null>(null);

  const selectedAttendeeData = attendees.find((a) => a.id === selectedAttendee);
  
  const unsent = attendees.filter((a) => !a.emailSent);

  const handleSendAll = async () => {
    if (unsent.length === 0) return;
    
    setIsSending(true);
    setProgress({ completed: 0, total: unsent.length });
    setResult(null);
    
    try {
      await sendBulkEmails(
        unsent,
        (completed, total) => {
          setProgress({ completed, total });
        },
        (success, failed) => {
          setResult({ success, failed });
          
          // Mark emails as sent for successful sends
          unsent.forEach((attendee) => {
            markEmailSent(attendee.id);
          });
        }
      );
    } catch (error) {
      console.error('Failed to send bulk emails:', error);
    } finally {
      setIsSending(false);
    }
  };

  const getBaseUrl = () => {
    return window.location.origin;
  };

  const getQRValue = (attendee: typeof selectedAttendeeData) => {
    if (!attendee) return '';
    return `${getBaseUrl()}/scan/${attendee.qrCode}`;
  };

  return (
    <Card title="QR Code Management" className="max-w-xl mx-auto">
      <div className="flex flex-col space-y-6">
        {selectedAttendeeData && (
          <div className="p-4 bg-gray-50 rounded-lg flex flex-col items-center">
            <h3 className="text-lg font-medium mb-2">{selectedAttendeeData.name}</h3>
            <p className="text-gray-500 mb-4">{selectedAttendeeData.email}</p>
            
            <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
              <QRCode
                value={getQRValue(selectedAttendeeData)}
                size={200}
                level="H"
                includeMargin={true}
              />
            </div>
            
            <p className="text-sm text-gray-500 mb-4 text-center">
              This QR code can be scanned at the event to check in the attendee.
            </p>
            
            <Button
              variant="outline"
              onClick={() => setSelectedAttendee(null)}
            >
              Close
            </Button>
          </div>
        )}

        <div className="mb-4">
          <h3 className="text-lg font-medium mb-4">Email QR Codes to Attendees</h3>
          {unsent.length === 0 ? (
            <div className="text-center py-4 text-gray-500">
              All QR codes have been sent.
            </div>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                Send personalized QR codes to {unsent.length} attendees who haven't received
                them yet.
              </p>
              <Button
                variant="primary"
                onClick={handleSendAll}
                isLoading={isSending}
                icon={<Mail size={16} />}
                disabled={isSending || unsent.length === 0}
              >
                Send {unsent.length} QR Codes
              </Button>
              
              {isSending && (
                <div className="mt-4">
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mb-2">
                    <div
                      className="bg-blue-600 h-2.5 rounded-full transition-all duration-300 ease-in-out"
                      style={{
                        width: `${Math.round(
                          (progress.completed / progress.total) * 100
                        )}%`,
                      }}
                    ></div>
                  </div>
                  <p className="text-sm text-gray-500">
                    Sending {progress.completed} of {progress.total}...
                  </p>
                </div>
              )}
              
              {result && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-md">
                  <h4 className="font-medium text-green-800 mb-1">Email Send Complete</h4>
                  <p className="text-green-700">
                    Successfully sent: {result.success} emails
                  </p>
                  {result.failed > 0 && (
                    <p className="text-red-600 flex items-center mt-1">
                      <AlertCircle size={16} className="mr-1" />
                      Failed to send: {result.failed} emails
                    </p>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {!selectedAttendee && attendees.length > 0 && (
          <div>
            <h3 className="text-lg font-medium mb-4">Preview Individual QR Codes</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {attendees.slice(0, 4).map((attendee) => (
                <div
                  key={attendee.id}
                  className="border border-gray-200 rounded-md p-4 hover:border-blue-400 hover:bg-blue-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAttendee(attendee.id)}
                >
                  <h4 className="font-medium truncate">{attendee.name}</h4>
                  <p className="text-sm text-gray-500 truncate">{attendee.email}</p>
                </div>
              ))}
            </div>
            {attendees.length > 4 && (
              <p className="text-sm text-gray-500 mt-2 text-center">
                And {attendees.length - 4} more attendees...
              </p>
            )}
          </div>
        )}
      </div>
    </Card>
  );
};

export default QRCodeGenerator;