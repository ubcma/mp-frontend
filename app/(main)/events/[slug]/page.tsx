'use client';

import { useGetEventQuery } from '@/lib/queries/event';
import { useParams } from 'next/navigation';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
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
import Spinner from '@/components/Spinner';

export default function EventPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data, isLoading, isError } = useGetEventQuery({ eventSlug: slug });

  return (
    <>
      {isLoading ? (
        <Spinner/>
      ) : (
        <div className="max-w-3xl mx-auto py-12 space-y-8">
          <div className="space-y-4">
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
            {/* Tags (if any) */}
            {data.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {data.tags.map((tag: string, index: number) => (
                  <Badge key={index}>{tag}</Badge>
                ))}
              </div>
            )}
          </div>

          {/* Registration Form (non-functional) */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold">Register</h2>
            <form className="space-y-6">
              {data.questions.map((q: any) => (
                <div key={q.id} className="space-y-2">
                  <Label>
                    {q.label}
                    {q.isRequired && <span className="text-red-500"> *</span>}
                  </Label>

                  {(q.type === 'ShortText' || q.type === 'LongText') && (
                    <Input
                      placeholder={q.placeholder || ''}
                      required={q.isRequired}
                    />
                  )}

                  {q.type === 'Select' && q.options?.length > 0 && (
                    <Select>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={q.placeholder || 'Select...'}
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {q.options.map((opt: string, index: number) => (
                          <SelectItem key={index} value={opt}>
                            {opt}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              ))}

              <Button type="submit" disabled>
                Submit (Coming Soon)
              </Button>
            </form>
          </Card>
        </div>
      )}
    </>
  );
}
