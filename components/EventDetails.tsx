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

      {user?.role === 'Basic' && event.membersOnly ? (
        <div className='flex flex-col justify-center items-center text-center rounded-xl w-full h-48 bg-ma-red/10 border-dashed border-ma-red border-2 gap-2'>
          <h3 className='font-semibold text-ma-red text-2xl capitalize'> This event is for members only! </h3>
          <p className='text-ma-red/80'>
            Purchase a membership to gain access to this event and many other perks.
          </p>
        </div>
      ) : (
        <div className="flex flex-col relative gap-4 py-1">
          {/* Registration Form */}
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
