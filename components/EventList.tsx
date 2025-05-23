'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Event } from '@/lib/types';
import { EventCard } from './EventCard';
import { useEventContext } from '@/context/EventContext';

export function EventList() {
  const { filteredEvents, isLoading } = useEventContext();

  if (isLoading) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (filteredEvents?.length === 0) {
    return (
      <div className="flex flex-col justify-center items-center w-full h-[50vh] text-center">
        <img
          src="/no_results_found.svg"
          alt="No events found"
          className="w-24 h-24 mb-4"
        />
        <h3 className='text-lg font-semibold'>No events found.</h3>
        <p className='text-muted-foreground text-sm max-w-96'>
          {"We couldn't find anything matching your search criteria. Try adjusting your filters or search terms"}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 w-full">
      {filteredEvents?.map((event: Event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
}
