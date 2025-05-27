export interface Attendee {
  id: string;
  email: string;
  name: string;
  organization?: string;
  checkedIn: boolean;
  checkInTime?: string;
  qrCode: string;
  emailSent: boolean;
}

export interface CSVRow {
  email: string;
  name: string;
  organization?: string;
  [key: string]: string | undefined;
}