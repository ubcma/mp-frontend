"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { EventDetails } from "@/lib/types"
import { type EventStatus, getEventStatus } from '@/lib/utils';
import { useGetEventsQuery } from "@/lib/queries/events"

type EventContextType = {
  filteredEvents: EventDetails[]
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventDetails[]>>
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

  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<EventStatus | "All">("All")

  const {data: events, isLoading } = useGetEventsQuery();

  useEffect(() => {
    const filtered = events?.filter(
      (event: EventDetails) =>
        (activeTab === "All" || getEventStatus(event.startsAt) === activeTab) &&
        event.title.toLowerCase().includes(searchTerm.toLowerCase()) &&
        event.isVisible === true
    )
    setFilteredEvents(filtered ?? [])
  }, [events, searchTerm, activeTab])

  return (
    <EventContext.Provider
      value={{
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

