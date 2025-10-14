'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn, getEventStatus, isEventFull } from '@/lib/utils';
import { EventDetails } from '@/lib/types';
import { useRouter } from 'next/navigation';
import { ArrowUpRight, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import dayjs from 'dayjs';
import Image from 'next/image';
import { isValidImageUrl } from '@/lib/uploadthing';

export function EventCard({
  event,
  registered,
}: {
  event: EventDetails;
  registered?: boolean;
}) {
  const status = getEventStatus(event.startsAt);
  const eventFull = isEventFull(event);

  const router = useRouter();

  const eventStartsAt = dayjs(event.startsAt);
  const dayOfTheWeek = eventStartsAt.format('ddd');
  const dayOfTheMonth = eventStartsAt.format('DD');
  const month = eventStartsAt.format('MMM');

  return (
    <button
      onClick={() => router.push(`/events/${event.slug}`)}
      className="transition-all duration-200 w-full h-full"
      disabled={status !== 'Upcoming' || eventFull}
    >
      <Card
        className={cn(
          'flex flex-col h-full overflow-hidden gap-0 p-0 bg-black group transition-transform duration-200',
          status !== 'Upcoming' || eventFull
            ? 'opacity-60'
            : 'hover:rotate-1 hover:scale-105'
        )}
      >
        <CardContent className="p-0 flex-1 flex flex-col relative">
          <div className="relative h-96">
            <div className="absolute flex flex-col items-center top-4 left-4 bg-white p-0.5 pb-1 rounded-[12px] w-16 h-fit z-10">
              <div className="rounded-t-[10px] bg-ma-red px-2 py-1 text-xs text-center uppercase font-medium text-white w-full">
                {month}
              </div>
              <p className="font-semibold text-black mt-0.5 -mb-0.5">
                {dayOfTheMonth}
              </p>
              <p className="text-xs font-normal text-[#888888]">
                {dayOfTheWeek}
              </p>
            </div>

            <Image
              src={
                isValidImageUrl(event.imageUrl)
                  ? event.imageUrl!
                  : '/no-event-image.png'
              }
              alt={event.title}
              height={1080}
              width={1080}
              className="absolute h-3/4 w-full object-cover"
            />

            <div className="absolute -bottom-4 left-0 w-full h-1/2 bg-gradient-to-t from-[#1c0207] via-[#220309] to-transparent z-10" />

            <div className="absolute bottom-0 p-4 pt-0 w-full text-center flex-1 flex flex-col justify-center z-20">
              <h3 className="text-xl text-white font-semibold">
                {event.title}
              </h3>
              <p className="text-white/60 truncate mb-4">{event.description}</p>
              {new Date(event.endsAt) < new Date() ? (
                <Button variant="ma" className="w-full text-white" disabled>
                  Event has ended.
                </Button>
              ) : !registered ? (
                status === 'Upcoming' && !eventFull ? (
                  <Button
                    onClick={() => router.push(`/events/${event.slug}`)}
                    variant="ma"
                    className="w-full group-hover:brightness-80 text-white"
                  >
                    Register for this event!
                    <ArrowUpRight className="h-4 w-4 group-hover:rotate-45 transition-transform duration-200 ease-in-out" />
                  </Button>
                ) : eventFull ? (
                  <Button variant="ma" className="w-full text-white" disabled>
                    Event is full.
                  </Button>
                ) : new Date(event.startsAt) < new Date() ? (
                  <Button variant="ma" className="w-full text-white" disabled>
                    Registration has passed.
                  </Button>
                ) : (
                  <Button variant="ma" className="w-full text-white" disabled>
                    Registration has passed.
                  </Button>
                )
              ) : (
                <Button className="w-full bg-emerald-500 hover:bg-emerald-500">
                  <CheckCircle className="h-4 w-4" />
                  You're registered!
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
