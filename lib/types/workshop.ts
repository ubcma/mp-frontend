export interface Workshop {
  id: number;
  eventId: number;
  slot: number;
  title: string;
  description: string | null;
  capacity: number;
  sortOrder: number;
  registeredCount: number;
  isFull: boolean;
}

// Keyed by slot number, e.g. { "1": 12, "2": 14 }
export type WorkshopSelection = Record<string, number>;

export interface EventWorkshopsResponse {
  workshops: Workshop[];
  mySelection: WorkshopSelection | null;
}

export const WORKSHOP_DESCRIPTION_MAX = 300;
