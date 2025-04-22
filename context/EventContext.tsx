"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import type { Event } from "@/types"
import { type EventStatus, getEventStatus } from "@/helpers/eventStatus"

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
  const [events, setEvents] = useState<Event[]>([])
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [activeTab, setActiveTab] = useState<EventStatus | "All">("All")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
      const fetchEvents = async () => {
        try {
          const eventsList = [] as Event[];
  
          eventsList.sort((a, b) => {
            const dateA = new Date(a.date).getTime();
            const dateB = new Date(b.date).getTime();
            return dateB - dateA; // Ascending order of most recent event
          });
          setEvents(eventsList);
          setIsLoading(false)
        } catch (error) {
          console.error("Error fetching events: ", error);
          setIsLoading(false)
        }
      };
  
      fetchEvents();
    }, []);

  useEffect(() => {
    const filtered = events.filter(
      (event) =>
        (activeTab === "All" || getEventStatus(event.date) === activeTab) &&
        event.eventName.toLowerCase().includes(searchTerm.toLowerCase()),
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

