'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bookmark, BookmarkCheck, ExternalLink, Mail } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import Image from 'next/image';

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

  const handleApply = () => {
    if (job.applicationType === 'external' && job.applicationUrl) {
      window.open(job.applicationUrl, '_blank');
    } else if (job.applicationType === 'email' && job.applicationEmail) {
      navigator.clipboard.writeText(job.applicationEmail);
      toast.success('Copied email to clipboard: ' + job.applicationEmail);
    }
    // For 'instructions' type, the instructions are displayed in the card
  };

  const getCompanyInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const truncate = (text: string, maxLength: number = 150) => {
  return text.length > maxLength ? `${text.slice(0, maxLength)}...` : text;
};

  return (
    <Card className="p-6 transition-shadow duration-200 flex flex-col bg-radial-[at_125%_100%] from-rose-50 via-white to-white border-rose-100/50">
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

          <div className="flex flex-col items-start justify-between gap-2 space-y-4">
            <div>
              <div className="flex flex-wrap gap-2 mb-1 text-lg font-semibold text-foreground">
                {job.title}
                <Badge variant="secondary" className="capitalize">
                  {job.type}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {job.companyName} • {getTimeAgo(job.postedAt)}
              </p>
            </div>

            <div className='text-sm text-muted-foreground'>{truncate(job.description, 300)}</div>
          </div>
        </div>

        {job.applicationType !== 'instructions' && (
          <Button onClick={handleApply} variant="ma" className='md:mt-0 mt-4 md:w-fit w-full'>
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
        )}
      </div>

      {/* Custom Application Instructions */}
      {job.applicationType === 'instructions' && job.applicationText && (
        <div className="w-full pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-semibold text-foreground mb-2">
            Application Instructions:
          </h4>
          <p className="text-sm text-muted-foreground whitespace-pre-wrap">
            {job.applicationText}
          </p>
        </div>
      )}
    </Card>
  );
}
