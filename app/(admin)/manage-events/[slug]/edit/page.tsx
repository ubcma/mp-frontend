'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import EventForm from '@/components/forms/EventForm';
import { toast } from 'sonner';
import Spinner from '@/components/common/Spinner';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { handleClientError } from '@/lib/error/handleClient';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useGetEventQuery({ eventSlug: slug });

  return (
    <div>
      {isLoading ? (
        <Spinner />
      ) : (
        <EventForm
          mode="update"
          initialValues={data?.event}
          onSubmit={async (data) => {
            try {
              const res = await fetchFromAPI('/api/events/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: data,
              });

              if (!res) {
                throw new Error('Failed to update event');
              } else {
                toast.success('Event updated!');
              }
            } catch (err: unknown) {
              handleClientError('Error', err);
            }
          }}
        />
      )}
    </div>
  );
}
