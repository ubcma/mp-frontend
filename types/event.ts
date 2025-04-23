export type Event = {
  id: string;
  title: string;
  price: string | null;
  date: Date;
  time: string | null;
  tags: string[] | null;
  description: string | null;
  imageUrl: string | null;
  stripeLink: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewEvent = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>;

export type EventQuestion = {
  id: string;
  eventId: string;
  questionText: string;
  questionType: string | null;
  required: boolean | null;
  sortOrder: number | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type NewEventQuestion = Omit<EventQuestion, 'id' | 'createdAt' | 'updatedAt'>;

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
