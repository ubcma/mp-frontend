'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getEventStatus, type EventStatus } from '@/helpers/eventStatus';
import { Event } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

export function EventCard({ event }: { event: Event }) {
  const status = getEventStatus(event.date);

  const router = useRouter();

  const dayjs = require('dayjs');
  const eventDate = dayjs(event.date);
  const dayOfTheWeek = eventDate.format('ddd');
  const dayOfTheMonth = eventDate.format('DD');
  const month = eventDate.format('MMM');

  // shadow-[inset_-4_-4px_8px_rgba(255,255,255,0.5)]

  return (
    <Link
      href={`/events/${event.title}`}
      className="hover:opacity-90 hover:rotate-1 hover:scale-105 transition-all duration-200"
    >
      <Card className="flex flex-col h-full overflow-hidden gap-0 p-0 bg-black">
        <CardContent className="p-0 flex-1 flex flex-col">
          <div className="relative">
            <div className="absolute left-4 top-4 bg-white p-[2px] pb-1 rounded-[12px] place-items-center w-16">
              <div className="rounded-t-[10px] bg-ma-red px-2 py-1 text-xs text-center uppercase font-medium text-white w-full">
                {month}
              </div>
              <p className="font-semibold text-foreground mt-0.5 -mb-0.5">
                {dayOfTheMonth}
              </p>
              <p className="text-xs font-normal text-muted-foreground">
                {dayOfTheWeek}
              </p>
            </div>
            <img
              src={event.imageUrl || '/placeholder.svg'}
              alt={event.title}
              className="h-64 w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent"></div>
          </div>
          <div className="p-6 pt-0 text-center flex-1 flex flex-col justify-center">
            <h3 className="text-xl text-white font-semibold">{event.title}</h3>
            <p className="text-muted-foreground truncate mb-4">
              {event.description}
            </p>
            {status === 'Upcoming' ? (
              <Button
                onClick={() => router.push(`/events/${event.title}`)}
                className="w-full bg-ma-red hover:bg-rose-600"
              >
                Register for this event!
                <ArrowUpRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button className="w-full bg-ma-red/60" disabled>
                Event has passed.
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
