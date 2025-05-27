import { Attendee } from '../types';

// Use relative URL to automatically match the current protocol and host
const API_URL = '/api';

export const sendQRCodeEmail = async (attendee: Attendee): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/send-qr-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendee,
        origin: window.location.origin,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: expected JSON');
    }

    const data = await response.json();
    return data.success;
  } catch (error) {
    console.error(`Failed to send email to ${attendee.email}:`, error);
    throw error; // Re-throw to allow component to handle the error
  }
};

export const sendBulkEmails = async (
  attendees: Attendee[],
  onProgress: (completed: number, total: number) => void,
  onComplete: (successful: number, failed: number) => void
): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/send-bulk-emails`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        attendees,
        origin: window.location.origin,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('Invalid response format: expected JSON');
    }
    
    const data = await response.json();
    
    if (data.success) {
      const { successful, failed, total } = data.summary;
      onProgress(total, total);
      onComplete(successful, failed);
    } else {
      throw new Error(data.error || 'Failed to send bulk emails');
    }
  } catch (error) {
    console.error('Failed to send bulk emails:', error);
    onComplete(0, attendees.length);
    throw error; // Re-throw to allow component to handle the error
  }
};