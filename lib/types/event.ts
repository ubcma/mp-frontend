export type CreateEventInput = {
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  startsAt: Date;
  endsAt: Date;
};

export type Event = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  startsAt: Date;
  endsAt: Date;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export type EventQuestion = {
  id: string;
  eventId: string;
  label: string;
  type: QuestionType;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
  validation?: Record<string, any>;
  sortOrder: number;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewEventQuestion = Omit<
  EventQuestion,
  'id' | 'createdAt' | 'updatedAt'
>;

export type Signup = {
  id: string;
  eventId: string;
  attendeeEmail: string;
  stripePaymentId: string | null;
  createdAt: string | null;
};

export type NewSignup = Omit<Signup, 'id' | 'createdAt'>;

export type SignupAnswer = {
  id: string;
  signupId: string;
  questionId: string;
  answer: string | null;
  createdAt: string | null;
};

export type NewSignupAnswer = Omit<SignupAnswer, 'id' | 'createdAt'>;

export const QUESTION_TYPES = [
  'ShortText',
  'LongText',
  'Email',
  'Number',
  'Date',
  'Time',
  'Radio',
  'Select',
  'Checkbox',
  'YesNo',
  'FileUpload',
] as const;

export type QuestionType = (typeof QUESTION_TYPES)[number];

export type QuestionInput = {
  id: string;
  label: string;
  placeholder?: string;
  type: QuestionType;
  isRequired: boolean;
  options?: string[];
  validation?: Record<string, any>;
  sortOrder: number;
};
