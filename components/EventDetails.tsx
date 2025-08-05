'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Shirt } from 'lucide-react';

export interface EventDetailsData {
  id: number;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  endsAt: string;
  price: number;
  imageUrl?: string;
}

export interface Question {
  id: number;
  eventId: number;
  label: string;
  placeholder?: string;
  type: string;
  isRequired: boolean;
  options?: string[];
}

interface EventDetailsProps {
  event: EventDetailsData;
  questions: Question[];
  user: { name: string; email: string };
  memberPrice?: number; // Optional member pricing
  dressCode?: string; // Optional dress code
}

const EventDetails: React.FC<EventDetailsProps> = ({ 
  event, 
  questions, 
  user, 
  memberPrice,
  dressCode 
}) => {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (questionId: number, value: string) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = questions.every(
    (q) => !q.isRequired || (responses[q.id] && responses[q.id].trim() !== '')
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid) return;

    setIsSubmitting(true);

    const dummyStripeData = {
      checkoutUrl: 'https://dummy.stripe.com/checkout/session',
      checkoutSessionId: 'dummy_session_id',
    };

    console.log('Signup Details:', {
      user,
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
    <div className="space-y-8">
      {/* Hero Image */}
      {event.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            src={event.imageUrl}
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Event Info Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[#09090b]">{event.title}</h1>

        {/* Dynamic pricing display */}
        <div className="text-[#71717a] text-base mt-1">
          {memberPrice ? (
            <p>
              ${memberPrice.toFixed(2)} for members (
              <span className="text-[#09090b] font-medium">
                ${Number(event.price).toFixed(2)} for non-members
              </span>
              )
            </p>
          ) : (
            <p className="text-[#09090b] font-medium">
              ${Number(event.price).toFixed(2)}
            </p>
          )}
        </div>

        {/* Dynamic Description */}
        {event.description && (
          <p className="text-[#71717a] text-sm mt-2">
            {event.description}
          </p>
        )}

        {/* Tag pills: date, location, dress code */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#cce0ff] text-[#4a7dca] rounded-full text-sm">
            <Calendar className="h-4 w-4 text-[#4a7dca]" />
            <span>{formatEventDate()}</span>
          </div>
          
          {event.location && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#dbccff] text-[#5d4aca] rounded-full text-sm">
              <MapPin className="h-4 w-4 text-[#5d4aca]" />
              <span>{event.location}</span>
            </div>
          )}
          
          {dressCode && (
            <div className="flex items-center gap-2 px-3 py-1 bg-[#fbccff] text-[#b14aca] rounded-full text-sm">
              <Shirt className="h-4 w-4 text-[#b14aca]" />
              <span>{dressCode}</span>
            </div>
          )}
        </div>
      </div>

      {/* Registration Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#09090b] mb-6">
            Event Registration Form
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label className="block text-[#09090b] font-medium">
                  {q.label}
                  {q.isRequired && <span className="text-red-500"> *</span>}
                </Label>

                {(q.type === 'ShortText' ||
                  q.type === 'LongText' ||
                  q.type === 'Email' ||
                  q.type === 'Number' ||
                  q.type === 'Date' ||
                  q.type === 'Time') && (
                  <Input
                    placeholder={q.placeholder || ''}
                    required={q.isRequired}
                    value={responses[q.id] || ''}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                  />
                )}

                {q.type === 'Select' && q.options && (
                  <Select
                    value={responses[q.id] || ''}
                    onValueChange={(value) => handleChange(q.id, value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder={q.placeholder || 'Select...'} />
                    </SelectTrigger>
                    <SelectContent>
                      {q.options.map((opt, i) => (
                        <SelectItem key={i} value={opt}>
                          {opt}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
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

export default EventDetails;