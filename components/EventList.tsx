"use client"

import { useEventContext } from "@/context/EventContext"
import { EventCard } from "./EventCard"
import { Skeleton } from "@/components/ui/skeleton"
import { Event } from "@/types"

export function EventList() {
  const { filteredEvents, isLoading } = useEventContext()

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    )
  }

  if (filteredEvents.length === 0) {
    return <p>No events found.</p>
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {filteredEvents.map((event: Event) => (
        <EventCard key={event.eventID} event={event} />
      ))}
    </div>
  )
}

