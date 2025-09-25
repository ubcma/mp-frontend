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
  applicationType: 'email' | 'external';
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
  };

  const getCompanyInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow duration-200 flex flex-col md:flex-row justify-start items-start md:justify-between">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-start gap-4">
        <div className="min-w-16 min-h-16 h-16 w-16 rounded-full text-primary-foreground flex items-center justify-center font-semibold text-2xl p-1">
          {job.companyLogo ? (
            <img
              src={job.companyLogo || '/placeholder.svg'}
              alt={`${job.companyName} logo`}
              className="w-full h-full rounded-full object-contain"
            />
          ) : (
            getCompanyInitial(job.companyName)
          )}
        </div>

        <div className="flex flex-col items-start justify-between gap-2">
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              {job.title}
            </h3>
            <p className="text-sm text-muted-foreground">
              {job.companyName} • {getTimeAgo(job.postedAt)}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="capitalize">
              {job.type}
            </Badge>
          </div>

          <div>{job.description}</div>
        </div>
      </div>

      <Button onClick={handleApply} variant="ma">
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
    </Card>
  );
}
