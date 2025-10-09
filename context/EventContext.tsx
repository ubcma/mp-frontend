'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import type { EventDetails } from '@/lib/types';
import { type EventStatus, getEventStatus } from '@/lib/utils';
import { useGetEventsQuery } from '@/lib/queries/events';
import { Registration, useGetUserRegistrationsQuery } from '@/lib/queries/registrations';

type EventContextType = {
  events: EventDetails[] | undefined;
  filteredEvents: EventDetails[];
  setFilteredEvents: React.Dispatch<React.SetStateAction<EventDetails[]>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  activeTab: EventStatus | 'All';
  setActiveTab: React.Dispatch<React.SetStateAction<EventStatus | 'All'>>;
  registrationFilter: 'All' | 'Registered';
  setRegistrationFilter: React.Dispatch<React.SetStateAction<'All' | 'Registered'>>;
  isLoading: boolean;
  registeredEvents: Registration[] | undefined;
};

const EventContext = createContext<EventContextType | undefined>(undefined);

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error('useEventContext must be used within an EventProvider');
  }
  return context;
};

export const EventProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [filteredEvents, setFilteredEvents] = useState<EventDetails[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<EventStatus | 'All'>('All');
  const [registrationFilter, setRegistrationFilter] = useState<'All' | 'Registered'>('All'); // New state

  const { data: events, isLoading } = useGetEventsQuery();
  const { data: registrations } = useGetUserRegistrationsQuery();

  const registeredEvents = registrations?.registrations;

  useEffect(() => {
    const filtered = events
      ?.filter((event: EventDetails) => {
        const matchesDateTab =
          activeTab === 'All' ||
          getEventStatus(event.startsAt) === activeTab;

        const matchesRegistrationTab =
          registrationFilter === 'All' ||
          (registrationFilter === 'Registered' &&
            registeredEvents?.some((regEvent) => regEvent.eventId === event.id));

        const matchesSearch = event.title
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

        return (
          matchesDateTab && matchesRegistrationTab && matchesSearch && event.isVisible === true
        );
      })
      .sort((a, b) => {
        return a.startsAt > b.startsAt ? -1 : 1;
      });

    setFilteredEvents(filtered ?? []);
  }, [events, searchTerm, activeTab, registrationFilter, registeredEvents]);

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
        registeredEvents,
        registrationFilter,
        setRegistrationFilter, // Expose the new state
      }}
    >
      {children}
    </EventContext.Provider>
  );
};
