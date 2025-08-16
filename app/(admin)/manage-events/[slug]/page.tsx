"use client"

import { useParams } from "next/navigation";
import { useGetEventQuery } from "@/lib/queries/event";
import EventRegistrations from "@/components/EventRegistrations";

export default function EventRegistrationsPage() {
  const params = useParams();
  const eventSlug = params.slug as string;
  
  // Get event details first to get the event ID and title
  const { data: eventData, isLoading: eventLoading, error: eventError } = useGetEventQuery({ eventSlug });
  
  if (eventLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }
  
  if (eventError || !eventData?.event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Event Not Found</h1>
          <p className="text-gray-600">The event you're looking for doesn't exist or you don't have permission to view it.</p>
        </div>
      </div>
    );
  }
  
  return (
    <EventRegistrations 
      eventId={eventData.event.id.toString()} 
      eventTitle={eventData.event.title}
    />
  );
}