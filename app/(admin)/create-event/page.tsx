'use client';

import EventForm from '@/components/forms/EventForm';
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
              body: data,
            });

            if (res) {
              toast.success('Event created!');
            } else {
              toast.error('Failed to create event');
            }

          } catch (err: any) {
            toast.error(err.message || 'An unexpected error occurred');
          }
        }}
      />
    </div>
  );
}
