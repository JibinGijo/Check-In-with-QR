import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Attendee, CSVRow } from '../types';
import { supabase } from '../lib/supabase';
import { v4 as uuidv4 } from '../utils/uuid';

interface AttendeeContextType {
  attendees: Attendee[];
  addAttendees: (newAttendees: CSVRow[]) => Promise<void>;
  checkInAttendee: (id: string) => Promise<void>;
  markEmailSent: (id: string) => Promise<void>;
  getAttendee: (id: string) => Attendee | undefined;
  getStats: () => { total: number; checkedIn: number; emailsSent: number };
}

const AttendeeContext = createContext<AttendeeContextType | undefined>(undefined);

export const AttendeeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [attendees, setAttendees] = useState<Attendee[]>([]);

  useEffect(() => {
    // Fetch attendees on mount
    const fetchAttendees = async () => {
      const { data, error } = await supabase
        .from('attendees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching attendees:', error);
        return;
      }

      setAttendees(data.map(row => ({
        id: row.id,
        email: row.email,
        name: row.name,
        organization: row.organization || '',
        checkedIn: row.checked_in,
        checkInTime: row.check_in_time,
        qrCode: row.qr_code,
        emailSent: row.email_sent
      })));
    };

    fetchAttendees();
  }, []);

  const addAttendees = async (newAttendees: CSVRow[]) => {
    const formattedAttendees = newAttendees.map((attendee) => ({
      email: attendee.email,
      name: attendee.name,
      organization: attendee.organization || null,
      qr_code: uuidv4(),
      checked_in: false,
      email_sent: false
    }));

    const { data, error } = await supabase
      .from('attendees')
      .upsert(formattedAttendees, {
        onConflict: 'email',
        ignoreDuplicates: true
      })
      .select();

    if (error) {
      console.error('Error adding attendees:', error);
      throw new Error('Failed to add attendees');
    }

    // Update local state with the new attendees
    setAttendees(prev => {
      const newAttendeeEmails = new Set(data.map(a => a.email));
      return [
        ...prev.filter(a => !newAttendeeEmails.has(a.email)),
        ...data.map(row => ({
          id: row.id,
          email: row.email,
          name: row.name,
          organization: row.organization || '',
          checkedIn: row.checked_in,
          checkInTime: row.check_in_time,
          qrCode: row.qr_code,
          emailSent: row.email_sent
        }))
      ];
    });
  };

  const checkInAttendee = async (id: string) => {
    const { error } = await supabase
      .from('attendees')
      .update({
        checked_in: true,
        check_in_time: new Date().toISOString()
      })
      .eq('id', id)
      .eq('checked_in', false);

    if (error) {
      console.error('Error checking in attendee:', error);
      throw new Error('Failed to check in attendee');
    }

    setAttendees(prev =>
      prev.map(attendee =>
        attendee.id === id
          ? {
              ...attendee,
              checkedIn: true,
              checkInTime: new Date().toISOString()
            }
          : attendee
      )
    );
  };

  const markEmailSent = async (id: string) => {
    const { error } = await supabase
      .from('attendees')
      .update({ email_sent: true })
      .eq('id', id);

    if (error) {
      console.error('Error marking email as sent:', error);
      throw new Error('Failed to mark email as sent');
    }

    setAttendees(prev =>
      prev.map(attendee =>
        attendee.id === id ? { ...attendee, emailSent: true } : attendee
      )
    );
  };

  const getAttendee = (id: string) => {
    return attendees.find((a) => a.id === id || a.qrCode === id);
  };

  const getStats = () => {
    return {
      total: attendees.length,
      checkedIn: attendees.filter((a) => a.checkedIn).length,
      emailsSent: attendees.filter((a) => a.emailSent).length,
    };
  };

  return (
    <AttendeeContext.Provider
      value={{
        attendees,
        addAttendees,
        checkInAttendee,
        markEmailSent,
        getAttendee,
        getStats,
      }}
    >
      {children}
    </AttendeeContext.Provider>
  );
};

export const useAttendees = () => {
  const context = useContext(AttendeeContext);
  if (context === undefined) {
    throw new Error('useAttendees must be used within an AttendeeProvider');
  }
  return context;
};