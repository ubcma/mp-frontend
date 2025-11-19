'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import RenderEventDetails from '@/components/EventDetails';
import EventPageSkeleton from '@/components/skeleton/EventPageSkeleton';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();
  const { data, isLoading, isError } = useGetEventQuery({ eventSlug: slug });

  if (isLoading) {
    return <EventPageSkeleton />;
  }

  if (isError || !data) {
    return <div>Error loading event details.</div>;
  }

  return <RenderEventDetails event={data.event} questions={data.questions}/>;
}
