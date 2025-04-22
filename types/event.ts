export interface Event {
  eventID: string;
  date: string;
  description: string;
  eventName: string;
  location: string;
  tag: EventTag;
  participant_list: string[];
  ongoing: boolean;
  signup_open: boolean;
  time: string;
  link: string;
  img: string;
}

export interface EventTag {
  networking: boolean;
  conference: boolean;
  competition: boolean;
  workshop: boolean;
}
