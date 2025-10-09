

type RegistrationStatus = 'checkedIn' | 'registered' | 'incomplete';

export interface EventRegistration {
  id: number;
  userId: string;
  eventId: number;
  stripeTransactionId: string | null;
  status: RegistrationStatus;
  registeredAt: string;
  userEmail: string;
  userName: string;
  userImage: string | null;
  firstName: string | null;
  lastName: string | null;
  studentNumber: string | null;
  yearOfStudy: number | null;
  faculty: string | null;
  phoneNumber: string | null;
  responses: Record<string, string>;
}

export interface EventQuestion {
  id: number;
  eventId: number;
  label: string;
  placeholder: string | null;
  type: string;
  isRequired: boolean;
  sortOrder: number;
  options: string[] | null;
  validation: any;
}

export interface EventRegistrationsResponse {
  registrations: EventRegistration[];
  questions: EventQuestion[];
}