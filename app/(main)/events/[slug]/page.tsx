'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import RenderEventDetails from '@/components/EventDetails';
import { Skeleton } from '@/components/ui/skeleton';


export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetEventQuery({ eventSlug: slug });

  if (isLoading) {
    return (
      <div className="grid gap-6 grid-cols-1">
        {[...Array(1)].map((_, i) => (
          <Skeleton key={i} className="h-[400px] w-full rounded-xl" />
        ))}
      </div>
    );
  }

  if (isError || !data) {
    return <div>Error loading event details.</div>;
  }

  return <RenderEventDetails event={data.event} questions={data.questions} />;
}
