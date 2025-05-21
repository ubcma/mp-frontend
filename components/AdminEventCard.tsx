'use client';

import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  MoreHorizontal,
  Calendar,
  Tag,
  MapPin,
  CheckCircle,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Event } from '@/lib/types';
import { Button } from './ui/button';
import { toast } from 'sonner';
import { fetchFromAPI } from '@/lib/httpHandlers';

interface AdminEventCardProps {
  event: Event;
  onEdit?: (id: string) => void;
}

export function AdminEventCard({ event, onEdit }: AdminEventCardProps) {
  const dayjs = require('dayjs');
  const eventStartsAt = dayjs(event.startsAt).format('MMMM D, YYYY');

  async function deleteEventById() {
    const {id} = event;

    try {
              
      const res = await fetchFromAPI('/api/events/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: { id: id },
      })

      if (!res) {
        throw new Error('Failed to delete event');
      } else {
        toast.success('Event deleted!');
      }

    } catch (err: any) {
      toast.error(err.message || 'An unexpected error occurred');
    }
  }

  return (
    <Card className="flex overflow-hidden mb-2 p-0">
      <div className="flex flex-1 p-4">
        <Image
          src={event.imageUrl || '/no-event-image.png'}
          alt={event.title}
          width={128}
          height={48}
          className='rounded-md mr-4'
        />
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-medium text-lg line-clamp-1">{event.title}</h3>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <div>{eventStartsAt}</div>
            </div>

            <div className="flex items-center gap-2">
              <Tag className="h-4 w-4 flex-shrink-0" />
              <span>${event.price}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{event.location}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col items-end justify-between">
          <div className="flex items-center gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
                <MoreHorizontal className="h-6 w-6" />
                <span className="sr-only">Open menu</span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => onEdit?.(event.slug)}>
                  Edit event
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href={`/events/${event.slug}`}>View public page</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Button variant='destructive' onClick={deleteEventById}>
                    Delete Event
                  </Button>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </Card>
  );
}
