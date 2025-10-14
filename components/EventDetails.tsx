'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BadgeCheckIcon, Calendar, MapPin, Shirt } from 'lucide-react';
import { EventDetails, EventQuestion } from '@/lib/types';
import DynamicFormField from '@/components/forms/DynamicFormField';
import TagPill from '@/components/TagPill';
import { useRouter } from 'next/navigation';
import { useUserQuery } from '@/lib/queries/user';
import { useGetUserRegistrationsQuery } from '@/lib/queries/registrations';
import { EventStatusMessage } from './EventStatusMessage';

interface EventDetailsProps {
  event: EventDetails;
  questions: EventQuestion[];
  memberPrice?: number;
  dressCode?: string;
}

const RenderEventDetails: React.FC<EventDetailsProps> = ({
  event,
  questions,
  memberPrice,
  dressCode,
}) => {
  const { data: user } = useUserQuery();
  const { data: registrations } = useGetUserRegistrationsQuery();

  const isRegistered = registrations?.registrations
    .map((registration) => registration.eventId)
    .includes(event.id);

  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleChange = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = questions.every((q) => {
    if (!q.isRequired) return true;
    const response = responses[q.id];
    if (Array.isArray(response)) return response.length > 0;
    if (typeof response === 'string') return response.trim() !== '';
    return response !== null && response !== undefined && response !== '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    router.push(`/purchase-event?eventSlug=${event.slug}`);
  };

  const formatEventDate = () => {
    const startDate = new Date(event.startsAt);
    const endDate = new Date(event.endsAt);
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${format(startDate, 'EEEE, MMMM d')} @ ${format(
        startDate,
        'h:mm a'
      )} - ${format(endDate, 'h:mm a')}`;
    } else {
      return `${format(startDate, 'MMM d, h:mm a')} - ${format(
        endDate,
        'MMM d, h:mm a'
      )}`;
    }
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      {event.imageUrl && (
        <div className="relative w-full h-80 rounded-lg overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Event Info */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{event.title}</h1>
        <div className="text-base text-muted-foreground">
          {memberPrice ? (
            <p>
              ${memberPrice.toFixed(2)} for members (
              <span className="font-medium">
                ${Number(event.price).toFixed(2)} for non-members
              </span>
              )
            </p>
          ) : (
            <p className="font-medium">${Number(event.price).toFixed(2)}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <TagPill
            icon={Calendar}
            text={formatEventDate()}
            textColor="#4a7dca"
            bgColor="#cce0ff"
          />
          {event.location && (
            <TagPill
              icon={MapPin}
              text={event.location}
              textColor="#5d4aca"
              bgColor="#dbccff"
            />
          )}
          {dressCode && (
            <TagPill
              icon={Shirt}
              text={dressCode}
              textColor="#b14aca"
              bgColor="#fbccff"
            />
          )}
          {event.membersOnly === true && (
            <TagPill
              icon={BadgeCheckIcon}
              text={'Member Exclusive Event'}
              textColor="#ff0957"
              bgColor="#ffcedd"
            />
          )}
        </div>
      </div>

      {/* Description */}
      {event.description && (
        <p className="text-sm text-muted-foreground">{event.description}</p>
      )}

      {new Date(event.startsAt) < new Date() ? (
        new Date(event.endsAt) < new Date() ? (
          <EventStatusMessage
            variant="error"
            title="Event has passed."
            description="This event has ended. Check out our upcoming events to find other opportunities."
          />
        ) : (
          <EventStatusMessage
            variant="error"
            title="Registration has closed!"
            description="This event has already started. Check out our upcoming events to find other opportunities."
          />
        )
      ) : isRegistered ? (
        <EventStatusMessage
          variant="success"
          title="You're already registered for this event!"
          description="We look forward to seeing you there."
        />
      ) : event.attendeeCap &&
        event.currentAttendeeCount &&
        event.currentAttendeeCount >= event.attendeeCap ? (
        <EventStatusMessage
          variant="warning"
          title="This event is sold out!"
          description="Follow our socials to keep up to date with our next events, we look forward to seeing you there."
        />
      ) : user?.role === 'Basic' && event.membersOnly ? (
        <EventStatusMessage
          variant="error"
          title="This event is for members only!"
          description="Purchase a membership to gain access to this event and many other perks."
        />
      ) : !user?.onboardingComplete ? (
        <EventStatusMessage
          variant="error"
          title="You haven't completed your profile yet!"
          description={
            <>
              Complete your{' '}
              <a
                href="/onboarding"
                className="hover:underline transition-transform duration-200 text-blue-500"
              >
                portal onboarding
              </a>{' '}
              to register for this event
            </>
          }
        />
      ) : (
        <div className="flex flex-col relative gap-4 py-1">
          {JSON.stringify(event)}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-6">Event Registration</h2>
              <form onSubmit={handleSubmit} className="space-y-6">
                {questions.map((q) => (
                  <DynamicFormField
                    key={q.id}
                    question={q}
                    value={responses[q.id]}
                    onChange={(value) => handleChange(q.id, value)}
                    error={
                      q.isRequired &&
                      (!responses[q.id] ||
                        (Array.isArray(responses[q.id]) &&
                          responses[q.id].length === 0) ||
                        (typeof responses[q.id] === 'string' &&
                          responses[q.id].trim() === ''))
                        ? `${q.label} is required.`
                        : undefined
                    }
                  />
                ))}

                <Button
                  type="submit"
                  disabled={!isFormValid || isSubmitting}
                  className="w-full bg-[#ef3050] hover:bg-[#ef3050]/90 text-white"
                >
                  {isSubmitting
                    ? 'Submitting...'
                    : `Continue to Purchase ($${Number(event.price).toFixed(2)})`}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default RenderEventDetails;
