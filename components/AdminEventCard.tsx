'use client';

import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Calendar, Tag, MapPin, ChartLine, LucideSettings, Users } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { EventDetails } from '@/lib/types';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { fetchFromAPI } from '@/lib/httpHandlers';
import dayjs from 'dayjs';
import { handleClientError } from '@/lib/error/handleClient';
import { isValidImageUrl } from '@/lib/uploadthing';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface AdminEventCardProps {
  event: EventDetails;
  onEdit?: (id: string) => void;
}

export function AdminEventCard({ event, onEdit }: AdminEventCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const eventStartsAt = dayjs(event.startsAt).format('MMMM D, YYYY');

  async function deleteEventById() {
    const { id } = event;

    try {
      const res = await fetchFromAPI('/api/events/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: { id: id },
      });

      if (!res) {
        throw new Error('Failed to delete event');
      } else {
        toast.success('Event deleted!');
        queryClient.invalidateQueries({ queryKey: ['events'] });
      }
    } catch (err: unknown) {
      handleClientError('Error', err);
    }
  }

  return (
    <div className="flex flex-row flex-wrap border p-4 border-neutral-200 rounded-md shadow-md">
      <Image
        src={
          isValidImageUrl(event.imageUrl)
            ? event.imageUrl!
            : '/no-event-image.png'
        }
        alt={event.title}
        width={256}
        height={128}
        className="rounded-md mr-4 aspect-[8/5] object-cover w-full md:w-32 mb-4 md:mb-0"
      />
      <div className="flex flex-col flex-1 justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg line-clamp-1">{event.title}</h3>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground mb-4 lg:mb-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <div className="line-clamp-1">{eventStartsAt}</div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 flex-shrink-0" />
              <span>${event.price}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="text-sm">
                {event.attendeeCap ? 
                  `${event.currentAttendeeCount || 0} / ${event.attendeeCap} attendees` :
                  `${event.currentAttendeeCount || 0} attendees`
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-row flex-wrap items-center gap-2">
          <Button
            className="bg-blue-700 hover:bg-blue-900 transition-colors shadow-[inset_0px_0px_32px_16px_rgba(255,255,255,0.2)]"
            onClick={() => router.push(`/manage-events/${event.slug}`)}
            size="sm"
          >
            Manage Registrations
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center justify-center rounded-md aspect-square h-full hover:bg-muted">
              <LucideSettings className="h-6 w-6 text-neutral-500" />
              <span className="sr-only">Open menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="cursor-pointer"
                onClick={() => onEdit?.(event.slug)}
              >
                Edit event details
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  className="cursor-pointer"
                  href={`/events/${event.slug}`}
                  prefetch={true}
                >
                  View public page
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <button
                  className="w-full text-ma-red transition-all duration-200 cursor-pointer"
                  onClick={deleteEventById}
                >
                  Delete Event
                </button>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}
