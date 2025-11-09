'use client';

import { JobCard, JobCardProps } from '@/components/JobCard';
import { useGetJobsQuery } from '@/lib/queries/jobs';
import { useUserQuery } from '@/lib/queries/user';
import Image from 'next/image';
import Spinner from './common/Spinner';
import { Button } from './ui/button';
import { ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

const CompactJobCard = ({ job }: JobCardProps) => {
  return (
    <div className="border-b last:border-b-0 border-gray-200 p-4 pr-6 transition-shadow w-full">
      <div className="flex flex-row justify-start items-center gap-4">
        <Image
          width={80}
          height={80}
          src={job.companyLogo || ''}
          alt={job.companyName + ' Logo'}
          className="aspect-square w-12 h-12 object-cover rounded-full"
        />

        <div className="flex flex-col">
          <h3 className="text-lg font-semibold">{job.title}</h3>
          <p className="text-sm text-gray-600">
            {job.companyName} • {job.location}
          </p>
        </div>
      </div>
    </div>
  );
};

export default function RecentJobs() {
  const { data, isLoading } = useGetJobsQuery();
  const { data: user } = useUserQuery();

  const activeJobs = data?.filter((job) => job.isActive) || [];

  if (user?.role === 'Basic') {
    return (
      <div className="w-full h-full flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-ma-red">
          This feature is exclusive for members.
        </h1>
        <p className="text-muted-foreground">
          Please upgrade your account to access job listings and other exclusive
          perks.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h2 className="text-lg font-medium text-muted-foreground">
        Recent job postings
      </h2>

      {/* Container for the list */}
      <div className="relative group flex flex-col border-gray-200 border rounded-md overflow-clip">
        <div className="flex flex-col">
          {/* Actual job cards */}
          {isLoading ? (
            <Spinner />
          ) : activeJobs.length > 0 ? (
            activeJobs
              .sort(
                (a, b) =>
                  new Date(b.postedAt).getTime() -
                  new Date(a.postedAt).getTime()
              )
              .slice(0, 3)
              .map((job, idx) => <CompactJobCard job={job} key={idx} />)
          ) : (
            <p className="text-muted-foreground">
              No active jobs available at the moment.
            </p>
          )}
        </div>

        {/* Full overlay covering the entire job list */}
        <Link
          className="
            absolute inset-0
            bg-white/70
            backdrop-blur-sm
            opacity-0
            flex items-center justify-center
            transition-all duration-300
            group-hover:opacity-100
            rounded-md
          "
          href={'/job-board'}
        >
          <p className="flex flex-row items-center text-ma-red font-bold text-2xl text-center px-6 group">
            View all opportunities in our job board
            <ArrowUpRight className="w-8 h-8 inline-block ml-2 group-hover:rotate-45 ease-out transition-transform duration-200 " />
          </p>
        </Link>
      </div>
    </div>
  );
}
