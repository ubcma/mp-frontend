'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from '@/components/Search';
import { EventStatus, getEventStatus } from '@/helpers/eventStatus';
import { EventList } from '@/components/EventList';
import { EventProvider, useEventContext } from '@/context/EventContext';
import { useGetEventsQuery } from '@/lib/queries/events';
import { Event } from '@/lib/types';
import { AdminEventCard } from '@/components/AdminEventCard';
import Spinner from '@/components/Spinner';

const tabs: { value: EventStatus | 'All'; label: string }[] = [
  { value: 'All', label: 'All' },
  { value: 'Upcoming', label: 'Upcoming' },
  { value: 'Ongoing', label: 'Ongoing' },
  { value: 'Past', label: 'Past' },
];

export default function Home() {
  const { data: events, isLoading, isError } = useGetEventsQuery();

  const router = useRouter();

  function onEdit(id: string) {
    router.push(`/manage-events/${id}`)
  }

  return (
    <div className="flex flex-col">
      {isLoading
        ? <Spinner/>
        : events.map((event: Event, index: number) => (
            <AdminEventCard key={index} event={event} onEdit={onEdit}/>
          ))}
    </div>
  );
}
