'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetEventsQuery } from '@/lib/queries/events';
import { EventDetails } from '@/lib/types';
import { AdminEventCard } from '@/components/AdminEventCard';
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';

export default function Home() {
  const { data: events, isLoading } = useGetEventsQuery();

  const router = useRouter();

  function onEdit(id: string) {
    router.push(`/manage-events/${id}/edit`); 
  }

  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4 h-full md:mt-0 mt-16">
      {isLoading ? (
        <Spinner />
      ) : events && events.length > 0 ? (
        events?.map((event: EventDetails, index: number) => (
          <AdminEventCard key={index} event={event} onEdit={onEdit} />
        ))
      ) : (
        <div className="flex flex-col justify-center items-center w-full h-full text-center">
          <img
            src="/no_results_found.svg"
            alt="No events found"
            className="w-24 h-24 mb-4"
          />
          <h3 className="text-lg font-semibold">No events created.</h3>
          <p className="text-muted-foreground text-sm max-w-96">
            {"Looks like you haven't created any events yet. You can start by "}
            <Link href='/create-event' className='font-semibold text-blue-500'>creating a new event.</Link>
          </p>
        </div>
      )}
    </div>
  );
}
