'use client';

import { JobCard } from '@/components/JobCard';
import { useGetJobsQuery } from '@/lib/queries/jobs';
import { useUserQuery } from '@/lib/queries/user';
import { use } from 'react';

export default function JobBoard() {
  const { data, isLoading, isError } = useGetJobsQuery();

  const { data: user } = useUserQuery();

  // Filter for only active jobs
  const activeJobs = data?.filter((job) => job.isActive) || [];

  if (user?.role === 'Basic') {
    return (
      <div className="w-full h-full flex flex-col gap-4">
        <h1 className="font-bold text-2xl text-ma-red">
          This feature is exclusive for members.
        </h1>
        <p className="text-muted-foreground">
          Please upgrade your account
          to access job listings and other exclusive perks.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="font-bold text-4xl text-ma-red">MA Job Board</h1>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : activeJobs.length > 0 ? (
        activeJobs.map((job, idx) => <JobCard job={job} key={idx} />)
      ) : (
        <p className="text-muted-foreground">
          No active jobs available at the moment.
        </p>
      )}
    </div>
  );
}
