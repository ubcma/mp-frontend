export type EventStatus = "Upcoming" | "Ongoing" | "Past"

export function getEventStatus(eventDate: string): EventStatus {
  const now = new Date()
  const event = new Date(eventDate)

  event.setHours(23, 59, 59, 999)

  if (event > now) {
    return "Upcoming"
  } else if (event.toDateString() === now.toDateString()) {
    return "Ongoing"
  } else {
    return "Past"
  }
}

