
export type EventDisplay = {
  event: EventDetails;
  questions: EventQuestion[];
  tags: string[];
}

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

export type EventDetails = {
  id: string;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  startsAt: Date;
  endsAt: Date;
  isVisible: boolean;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewEvent = Omit<EventDetails, 'id' | 'createdAt' | 'updatedAt'>;

export type EventQuestion = {
  id: number;
  eventId: string;
  label: string;
  type: QuestionType;
  isRequired: boolean;
  placeholder?: string;
  options?: string[];
  validation?: Record<string, unknown>;
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
  validation?: Record<string, unknown>;
  sortOrder: number;
};

export type EventQuestionResponse = string | number | boolean | string[] | null | Date;

export type BaseEventForm = {
  id: string | null;
  title: string;
  slug: string;
  description: string;
  imageUrl: string;
  price: number;
  location: string;
  isVisible: boolean;
  startsAt: string;
  endsAt: string;
};

export type CreateEventPayload = Omit<BaseEventForm, 'startsAt' | 'endsAt'> & {
  startsAt: Date;
  endsAt: Date;
  questions: EventQuestion[];
};

export type UpdateEventPayload = Omit<BaseEventForm, 'startsAt' | 'endsAt'> & {
  startsAt: Date;
  endsAt: Date;
};

export type EventPayload = CreateEventPayload | UpdateEventPayload;