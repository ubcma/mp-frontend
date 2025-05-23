'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetEventsQuery } from '@/lib/queries/events';
import { Event } from '@/lib/types';
import { AdminEventCard } from '@/components/AdminEventCard';
import Spinner from '@/components/Spinner';

export default function Home() {
  const { data: events, isLoading } = useGetEventsQuery();

  const router = useRouter();

  function onEdit(id: string) {
    router.push(`/manage-events/${id}`)
  }

  return (
    <div className="flex flex-col">
      {isLoading
        ? <Spinner/>
        : events?.map((event: Event, index: number) => (
            <AdminEventCard key={index} event={event} onEdit={onEdit}/>
          ))}
    </div>
  );
}
