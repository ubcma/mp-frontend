'use client';

import EventForm from '@/components/forms/EventForm';
import { toast } from 'sonner';

export default function Home() {
  return (
    <div>
      <EventForm
        mode="create"
        onSubmit={async (data) => {
          try {
            const res = await fetch('/api/events/create', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            });

            if (!res.ok) {
              const errorData = await res.json().catch(() => ({}));
              throw new Error(errorData.message || 'Failed to create event');
            }

            toast.success('Event created!');
          } catch (err: any) {
            toast.error(err.message || 'An unexpected error occurred');
          }
        }}
      />
    </div>
  );
}
