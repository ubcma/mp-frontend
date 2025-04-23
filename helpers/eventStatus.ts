export type EventStatus = "Upcoming" | "Ongoing" | "Past"

export const getEventStatus = (date: Date) => {
  const today = new Date()
  const eventDate = new Date(date)

  if (eventDate > today) {
    return "Upcoming"
  } else if (eventDate.toDateString() === today.toDateString()) {
    return "Ongoing"
  } else {
    return "Past"
  }
}

