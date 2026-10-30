'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useEventWorkshopsQuery } from '@/lib/queries/workshops';
import { useParams } from 'next/navigation';
import EventForm from '@/components/forms/EventForm';
import { toast } from 'sonner';
import Spinner from '@/components/common/Spinner';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { handleClientError } from '@/lib/error/handleClient';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading } = useGetEventQuery({ eventSlug: slug });
  const { data: workshopsData, isLoading: isWorkshopsLoading } = useEventWorkshopsQuery(
    data?.event.id
  );

  return (
    <div>
      {isLoading || isWorkshopsLoading ? (
        <Spinner />
      ) : (
        <EventForm
          mode="update"
          initialValues={data?.event}
          initialWorkshops={workshopsData?.workshops ?? []}
          onSubmit={async (data) => {
            try {

              console.log('body: ', data)
              const res = await fetchFromAPI('/api/events/update', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include',
                body: data,
              });

              console.log(res);

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
