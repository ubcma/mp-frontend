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

export interface EventDetailsData {
  id: number;
  title: string;
  description: string;
  location: string;
  startsAt: string;
  price: number;
  imageUrl?: string;
  // Extend if needed
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
}

const EventDetails: React.FC<EventDetailsProps> = ({ event, questions, user }) => {
  const [responses, setResponses] = useState<{ [key: number]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (questionId: number, value: string) => {
    setResponses(prev => ({ ...prev, [questionId]: value }));
  };

  const isFormValid = questions.every(
    q => !q.isRequired || (responses[q.id] && responses[q.id].trim() !== '')
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

  return (
    <div className="space-y-8">
      {/* Hero Image */}
      {event.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden">
          <Image
            // src={event.imageUrl}
            src={"https://pq44cnt1zt.ufs.sh/f/yWjajdKSlYnoG7FCyX5qW3K91vwg42msxzbiEo5QVIXSjhyZ"} // filler
            alt={event.title}
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Event Info Section */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold text-[#09090b]">{event.title}</h1>

        {/* Price under title */}
        <p className="text-[#71717a] text-base mt-1">
          $24.00 for members (<span className="text-[#09090b] font-medium">${Number(event.price).toFixed(2)} for non-members</span>)
        </p>

        {/* Description */}
        <p className="text-[#71717a] text-sm mt-2">
          UBCMA Gateways is an annual marketing conference organized by the UBC Marketing Association (UBCMA),
          designed to connect students with industry professionals and provide learning and networking opportunities.
        </p>

        {/* Tag pills: date, location, dress code */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-[#cce0ff] text-[#4a7dca] rounded-full text-sm">
            <span role="img" aria-label="calendar">📅</span>
            <span>{format(new Date(event.startsAt), 'EEEE, MMMM d @ h:mm a')}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#dbccff] text-[#5d4aca] rounded-full text-sm">
            <span role="img" aria-label="location">📍</span>
            <span>{event.location || 'AMS Great Hall'}</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-[#fbccff] text-[#b14aca] rounded-full text-sm">
            <span role="img" aria-label="attire">👔</span>
            <span>Business Formal</span>
          </div>
        </div>
      </div>

      {/* Registration Form */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold text-[#09090b] mb-6">Event Registration Form</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {questions.map((q) => (
              <div key={q.id} className="space-y-2">
                <Label className="block text-[#09090b] font-medium">
                  {q.label}
                  {q.isRequired && <span className="text-red-500"> *</span>}
                </Label>

                {(q.type === 'ShortText' || q.type === 'LongText' || q.type === 'Email' || q.type === 'Number' || q.type === 'Date' || q.type === 'Time') && (
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
              {isSubmitting ? 'Submitting...' : `Continue with Purchase ($${Number(event.price).toFixed(2)})`}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EventDetails;
