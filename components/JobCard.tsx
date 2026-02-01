'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ExternalLink, Mail, Linkedin, Users, ChevronDown } from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { useGetAlumniByCompanyQuery } from '@/lib/queries/alumni';

export interface JobListing {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string | null;
  description: string;
  type: string;
  location: string;
  applicationType: 'email' | 'external' | 'instructions';
  applicationUrl: string | null;
  applicationEmail: string | null;
  applicationText: string | null;
  postedAt: string;
  updatedAt: string;
  isActive: boolean;
}

export interface JobCardProps {
  job: JobListing;
  salary?: string;
  tags?: string[];
}

export function JobCard({ job, tags = [] }: JobCardProps) {
  const { data: alumni = [] } = useGetAlumniByCompanyQuery(job.companyName);

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInDays = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return '1 day ago';
    if (diffInDays < 30) return `${diffInDays} days ago`;
    if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
    return `${Math.floor(diffInDays / 365)} years ago`;
  };

  const handleApply = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (job.applicationType === 'external' && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    } else if (job.applicationType === 'email' && job.applicationEmail) {
      navigator.clipboard.writeText(job.applicationEmail);
      toast.success('Copied email to clipboard: ' + job.applicationEmail);
    }
  };

  const getCompanyInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n.charAt(0).toUpperCase())
      .slice(0, 2)
      .join('');
  };

  return (
    <Card className="transition-shadow duration-200 flex flex-col bg-radial-[at_125%_100%] from-rose-50 via-white to-white border-rose-100/50">
      <Accordion type="single" collapsible>
        <AccordionItem value="details" className="border-b-0">
          <div className="p-6 pb-4">
            <div className="flex flex-col md:flex-row justify-start items-start md:justify-between">
              <div className="flex flex-col md:flex-row items-start justify-start gap-4">
                <div className="min-w-16 min-h-16 h-16 w-16 rounded-full text-primary-foreground flex items-start justify-start font-semibold text-2xl p-1">
                  {job.companyLogo ? (
                    <Image
                      src={job.companyLogo || '/placeholder.svg'}
                      alt={`${job.companyName} logo`}
                      width={320}
                      height={320}
                      className="w-full h-full rounded-full object-contain"
                    />
                  ) : (
                    getCompanyInitial(job.companyName)
                  )}
                </div>

                <div className="flex flex-col items-start justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap gap-2 mb-1 text-lg font-semibold text-foreground">
                      {job.title}
                      <Badge variant="secondary" className="capitalize">
                        {job.type}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {job.companyName} • {getTimeAgo(job.postedAt)}
                      {job.location && ` • ${job.location}`}
                    </p>
                  </div>
                </div>
              </div>

              <AccordionTrigger className="md:mt-0 mt-4 hover:no-underline [&>svg]:hidden">
                <span className="flex items-center gap-2 text-sm font-medium bg-rose-50 hover:bg-rose-100 text-rose-700 px-4 py-2 rounded-md transition-colors">
                  View details
                  {alumni.length > 0 && (
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5" />
                      {alumni.length}
                    </span>
                  )}
                  <ChevronDown className="w-4 h-4 transition-transform duration-200 [[data-state=open]_&]:rotate-180" />
                </span>
              </AccordionTrigger>
            </div>
          </div>

          <AccordionContent className="px-6 pb-6">
            {/* Description */}
            <div className="mb-4">
              <h4 className="text-sm font-semibold text-foreground mb-2">
                Description
              </h4>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                {job.description}
              </p>
            </div>

            {/* Application Instructions */}
            {job.applicationType === 'instructions' && job.applicationText && (
              <div className="mb-4 pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-semibold text-foreground mb-2">
                  Application Instructions
                </h4>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {job.applicationText}
                </p>
              </div>
            )}

            {/* Apply Button */}
            {job.applicationType !== 'instructions' && (
              <div className="mb-4 pt-4 border-t border-neutral-200">
                <Button
                  onClick={handleApply}
                  variant="ma"
                  className="w-full md:w-auto"
                >
                  {job.applicationType === 'external' && (
                    <>
                      View Posting
                      <ExternalLink className="w-4 h-4 ml-1" />
                    </>
                  )}
                  {job.applicationType === 'email' && (
                    <>
                      Copy Email
                      <Mail className="w-4 h-4 ml-1" />
                    </>
                  )}
                </Button>
              </div>
            )}

            {/* Alumni at Company */}
            {alumni.length > 0 && (
              <div className="pt-4 border-t border-neutral-200">
                <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  {alumni.length} {alumni.length === 1 ? 'person' : 'people'} at{' '}
                  {job.companyName}
                </h4>
                <div className="flex flex-col gap-2">
                  {alumni.map((person) => (
                    <div
                      key={person.id}
                      className="flex items-center gap-3 p-3 bg-rose-50 rounded-lg border border-rose-100"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarFallback className="bg-white text-rose-700 text-sm font-medium">
                          {getInitials(person.fullName)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">
                          {person.fullName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {person.currentTitle}
                          {person.graduationYear &&
                            ` • Class of ${person.graduationYear}`}
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        {person.linkedinUrl && (
                          <a
                            href={person.linkedinUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 rounded-full hover:bg-blue-50 text-blue-600 hover:text-blue-800 transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Linkedin className="w-4 h-4" />
                          </a>
                        )}
                        {person.contactEmail && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(person.contactEmail!);
                              toast.success('Copied email: ' + person.contactEmail);
                            }}
                            className="p-2 rounded-full hover:bg-rose-100 text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Mail className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </Card>
  );
}
