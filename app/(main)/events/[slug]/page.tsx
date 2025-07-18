'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
// Import the new EventSignUp component
import EventDetails from '@/components/EventDetails';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetEventQuery({ eventSlug: slug });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError || !data) {
    return <div>Error loading event details.</div>;
  }

  // Dummy user information; replace with actual user data as needed.
  const user = { name: 'Test User', email: 'test@example.com' };

  return (
    <div className="max-w-full space-y-8">
      {/* Event Details Section */}
      {/* <div className="space-y-4">
        <h1 className="text-3xl font-semibold">{data.event.title}</h1>
        <p className="text-muted-foreground">{data.event.description}</p>
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div>
            <strong>Date:</strong>{' '}
            {format(new Date(data.event.startsAt), 'MMMM d, yyyy h:mm a')}
          </div>
          <div>
            <strong>Location:</strong> {data.event.location}
          </div>
          <div>
            <strong>Price:</strong> ${data.event.price}
          </div>
        </div>

        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {data.tags.map((tag: string, index: number) => (
              <Badge key={index}>{tag}</Badge>
            ))}
          </div>
        )}
      </div> */}

      {/* Registration / Signup Form using EventSignUp component */}
      <EventDetails 
        event={data.event} 
        questions={data.questions} 
        user={user} 
      />

      Debug: Render raw data
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}