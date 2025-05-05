'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import EventForm from '@/components/forms/EventForm';
import { toast } from 'sonner';
import Spinner from '@/components/Spinner';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useGetEventQuery({ eventSlug: slug });

  return (
    <div>
      {isLoading ? (
        <Spinner/>
      ) : (
        <EventForm
          mode="update"
          initialValues={data.event}
          onSubmit={async (data) => {
            try {
              
              const res = await fetch('/api/events/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: data.id, ...data }),
              })
 
              if (!res.ok) {
                const errorData = await res.json().catch(() => ({}));
                throw new Error(errorData.message || 'Failed to update event');
              }
        
              toast.success('Event updated!');
            } catch (err: any) {
              toast.error(err.message || 'An unexpected error occurred');
            }
          }}
        />
      )}
    </div>
  );
}
