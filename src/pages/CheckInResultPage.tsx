import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAttendees } from '../context/AttendeeContext';
import { supabase } from '../lib/supabase';
import Card from '../components/common/Card';
import Button from '../components/common/Button';
import { CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const CheckInResultPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { getAttendee, checkInAttendee } = useAttendees();
  const [isCheckedIn, setIsCheckedIn] = useState(false);
  const [attendeeName, setAttendeeName] = useState('');
  const [attendeeEmail, setAttendeeEmail] = useState('');
  const [isFound, setIsFound] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const processCheckIn = async () => {
      if (id) {
        try {
          const attendee = getAttendee(id);
          
          if (attendee) {
            setIsFound(true);
            setAttendeeName(attendee.name);
            setAttendeeEmail(attendee.email);
            
            if (attendee.checkedIn) {
              setIsCheckedIn(true);
            } else {
              // Update the database directly
              const { error: dbError } = await supabase
                .from('attendees')
                .update({
                  checked_in: true,
                  check_in_time: new Date().toISOString()
                })
                .eq('id', attendee.id);

              if (dbError) {
                console.error('Database update error:', dbError);
                setError('Failed to update check-in status');
                return;
              }

              // Update local state through context
              await checkInAttendee(attendee.id);
              setIsCheckedIn(true);
            }
          }
        } catch (err) {
          console.error('Check-in error:', err);
          setIsFound(false);
          setError('Failed to process check-in');
        }
      }
    };

    processCheckIn();
  }, [id, getAttendee, checkInAttendee]);

  const handleBack = () => {
    navigate('/scanner');
  };

  return (
    <Card title="Check-In Result" className="max-w-md mx-auto">
      <div className="flex flex-col items-center justify-center py-8">
        {isFound ? (
          <>
            <div
              className={`flex items-center justify-center h-24 w-24 rounded-full mb-6 ${
                isCheckedIn ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
              {isCheckedIn ? (
                <CheckCircle className="h-12 w-12 text-green-600" />
              ) : (
                <XCircle className="h-12 w-12 text-red-600" />
              )}
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              {isCheckedIn ? 'Check-In Successful!' : 'Already Checked In'}
            </h2>
            
            <p className="text-gray-600 text-center mb-2">
              {attendeeName}
            </p>
            <p className="text-gray-500 text-sm text-center mb-8">
              {attendeeEmail}
            </p>

            {error && (
              <p className="text-red-600 text-sm text-center mb-8">
                {error}
              </p>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-center h-24 w-24 rounded-full mb-6 bg-red-100">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 text-center mb-2">
              Invalid QR Code
            </h2>
            
            <p className="text-gray-600 text-center mb-8">
              This QR code is not valid or the attendee is not registered.
            </p>
          </>
        )}
        
        <Button
          variant="primary"
          onClick={handleBack}
          icon={<ArrowLeft size={16} />}
        >
          Back to Scanner
        </Button>
      </div>
    </Card>
  );
};

export default CheckInResultPage;