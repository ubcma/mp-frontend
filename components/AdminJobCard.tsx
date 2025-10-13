'use client';

import { Card } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { 
  MoreHorizontal, 
  Briefcase, 
  MapPin, 
  LucideSettings,
  Building2,
  CheckCircle2,
  XCircle,
  ExternalLink,
  Mail,
} from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { toast } from 'sonner';
import { fetchFromAPI } from '@/lib/httpHandlers';
import dayjs from 'dayjs';
import { handleClientError } from '@/lib/error/handleClient';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

interface Job {
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

interface AdminJobCardProps {
  job: Job;
  onEdit?: (id: string) => void;
}

export function AdminJobCard({ job, onEdit }: AdminJobCardProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const postedDate = dayjs(job.postedAt).format('MMMM D, YYYY');
  const updatedDate = dayjs(job.updatedAt).format('MMMM D, YYYY');

  const getCompanyInitial = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  const formatJobType = (type: string) => {
    return type.replace('_', ' ').replace(/\b\w/g, (l) => l.toUpperCase());
  };

  async function deleteJobById() {
    const { id } = job;

    try {
      const res = await fetchFromAPI('/api/jobs/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: { id: id },
      });

      if (!res) {
        throw new Error('Failed to delete job');
      } else {
        toast.success('Job deleted!');
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      }
    } catch (err: unknown) {
      handleClientError('Error', err);
    }
  }

  async function toggleJobStatus() {
    const { id, isActive } = job;

    try {
      const res = await fetchFromAPI('/api/jobs/update', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: { 
          id,
          title: job.title,
          companyName: job.companyName,
          companyLogo: job.companyLogo,
          location: job.location,
          description: job.description,
          type: job.type,
          applicationType: job.applicationType,
          applicationUrl: job.applicationUrl,
          applicationEmail: job.applicationEmail,
          applicationText: job.applicationText,
          isActive: !isActive,
        },
      });

      if (!res) {
        throw new Error('Failed to update job status');
      } else {
        toast.success(`Job ${!isActive ? 'activated' : 'deactivated'}!`);
        queryClient.invalidateQueries({ queryKey: ['jobs'] });
      }
    } catch (err: unknown) {
      handleClientError('Error', err);
    }
  }

  return (
    <div className="relative flex flex-row flex-wrap border p-4 border-neutral-200 rounded-md shadow-md">
      {/* Settings Button - Top Right */}
      <div className="absolute top-4 right-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center justify-center rounded-md aspect-square h-8 w-8 hover:bg-muted">
            <LucideSettings className="h-5 w-5 text-neutral-500" />
            <span className="sr-only">Open menu</span>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={toggleJobStatus}
            >
              {job.isActive ? 'Deactivate Job' : 'Activate Job'}
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                className="cursor-pointer"
                href={`/job-board`}
                prefetch={true}
              >
                View on Job Board
              </Link>
            </DropdownMenuItem>
            {job.applicationType === 'external' && job.applicationUrl && (
              <DropdownMenuItem asChild>
                <a
                  className="cursor-pointer"
                  href={job.applicationUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View Application Link
                </a>
              </DropdownMenuItem>
            )}
            <DropdownMenuItem asChild>
              <button
                className="w-full text-ma-red transition-all duration-200 cursor-pointer"
                onClick={deleteJobById}
              >
                Delete Job
              </button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Company Logo */}
      <div className="min-w-32 min-h-32 h-32 w-32 rounded-md mr-4 bg-neutral-100 flex items-center justify-center mb-4 md:mb-0">
        {job.companyLogo ? (
          <Image
            src={job.companyLogo || '/placeholder.svg'}
            alt={`${job.companyName} logo`}
            width={128}
            height={128}
            className="rounded-md object-contain w-full h-full p-2"
          />
        ) : (
          <div className="text-4xl font-semibold text-neutral-400">
            {getCompanyInitial(job.companyName)}
          </div>
        )}
      </div>

      {/* Job Details */}
      <div className="flex flex-col flex-1 justify-between pr-10">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="font-medium text-lg line-clamp-1">{job.title}</h3>
            <Badge variant={job.isActive ? 'default' : 'secondary'}>
              {job.isActive ? (
                <>
                  <CheckCircle2 className="w-3 h-3 mr-1" />
                  Active
                </>
              ) : (
                <>
                  <XCircle className="w-3 h-3 mr-1" />
                  Inactive
                </>
              )}
            </Badge>
            <Badge variant="outline" className="capitalize">
              {formatJobType(job.type)}
            </Badge>
          </div>

          <div className="space-y-1 text-sm text-muted-foreground mb-4 lg:mb-2">
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4 flex-shrink-0" />
              <div className="line-clamp-1">{job.companyName}</div>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">{job.location}</span>
            </div>

            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 flex-shrink-0" />
              <span className="line-clamp-1">
                {job.applicationType === 'external' && 'External Application'}
                {job.applicationType === 'email' && `Email: ${job.applicationEmail}`}
                {job.applicationType === 'instructions' && 'Custom Instructions'}
              </span>
            </div>

            <div className="text-xs text-muted-foreground mt-2">
              Posted: {postedDate} | Updated: {updatedDate}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}