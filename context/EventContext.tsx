"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Event } from "@/types"
import { type EventStatus, getEventStatus } from "@/helpers/eventStatus"
import { useGetEventsQuery } from "@/lib/queries/events"

type EventContextType = {
  events: Event[]
  filteredEvents: Event[]
  setFilteredEvents: React.Dispatch<React.SetStateAction<Event[]>>
  searchTerm: string
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>
  activeTab: EventStatus | "All"
  setActiveTab: React.Dispatch<React.SetStateAction<EventStatus | "All">>
  isLoading: boolean
}

const EventContext = createContext<EventContextType | undefined>(undefined)

export const useEventContext = () => {
  const context = useContext(EventContext)
  if (context === undefined) {
    throw new Error("useEventContext must be used within an EventProvider")
  }
  return context
}

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<EventStatus | "All">("All")

  const {data: events, isLoading, isError } = useGetEventsQuery();

  useEffect(() => {
    const filtered = events?.filter(
      (event: Event) =>
        (activeTab === "All" || getEventStatus(event.date) === activeTab) &&
        event.title.toLowerCase().includes(searchTerm.toLowerCase()),
    )
    setFilteredEvents(filtered)
  }, [events, searchTerm, activeTab])

  return (
    <EventContext.Provider
      value={{
        events,
        filteredEvents,
        setFilteredEvents,
        searchTerm,
        setSearchTerm,
        activeTab,
        setActiveTab,
        isLoading,
      }}
    >
      {children}
    </EventContext.Provider>
  )
}

