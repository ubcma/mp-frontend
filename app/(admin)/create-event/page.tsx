'use client';

import EventForm from '@/components/forms/EventForm';
import { handleClientError } from '@/lib/error/handleClient';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { toast } from 'sonner';

export default function Home() {
  return (
    <div>
      <EventForm
        mode="create"
        onSubmit={async (data) => {
          try {
            console.log('Creating event with data:', data);

            const res = await fetchFromAPI('/api/events/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              credentials: 'include',
              body: data,
            });

            const result = (await res.json()) as {
              success: boolean;
              eventId: string;
            };

            if (result.success) {
              toast.success('Event created!');
            }

          } catch (err: unknown) {
            handleClientError('Error creating event', err);
          }
        }}
      />
    </div>
  );
}
