'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Calendar, MapPin, Shirt } from 'lucide-react';
import { EventDetails, EventQuestion } from '@/lib/types';
import DynamicFormField from '@/components/forms/DynamicFormField'; // Adjust path as needed
import TagPill from '@/components/TagPill'; // Adjust the import path as needed

interface EventDetailsProps {
  event: EventDetails;
  questions: EventQuestion[];
  memberPrice?: number; // Optional member pricing
  dressCode?: string; // Optional dress code
}

const RenderEventDetails: React.FC<EventDetailsProps> = ({
  event,
  questions,
  memberPrice,
  dressCode,
}) => {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = questions.every((q) => {
    if (!q.isRequired) return true;

    const response = responses[q.id];

    // Handle different response types
    if (Array.isArray(response)) {
      return response.length > 0;
    }

    if (typeof response === 'string') {
      return response.trim() !== '';
    }

    return response !== null && response !== undefined && response !== '';
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    const dummyStripeData = {
      checkoutUrl: 'https://dummy.stripe.com/checkout/session',
      checkoutSessionId: 'dummy_session_id',
    };

    console.log('Signup Details:', {
      responses,
      stripe: dummyStripeData,
    });

    setIsSubmitting(false);
  };

  // Format the event date range
  const formatEventDate = () => {
    const startDate = new Date(event.startsAt);
    const endDate = new Date(event.endsAt);

    // If same day, show date with time range
    if (startDate.toDateString() === endDate.toDateString()) {
      return `${format(startDate, 'EEEE, MMMM d')} @ ${format(startDate, 'h:mm a')} - ${format(endDate, 'h:mm a')}`;
    } else {
      // If different days, show full date range
      return `${format(startDate, 'MMM d, h:mm a')} - ${format(endDate, 'MMM d, h:mm a')}`;
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

      {/* Event Info Section */}
      <div className="space-y-1">
        <h1 className="text-3xl font-semibold">{event.title}</h1>

        {/* Dynamic pricing display */}
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

        {/* Tag pills using the reusable component */}
        <div className="flex flex-wrap gap-3 mt-2">
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
        </div>
      </div>



        {/* Dynamic Description */}
        {event.description && (
          <p className="text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

      {/* Registration Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">
            Event Registration Form
          </h2>
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
                : `Continue with Purchase ($${Number(event.price).toFixed(2)})`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default RenderEventDetails;
