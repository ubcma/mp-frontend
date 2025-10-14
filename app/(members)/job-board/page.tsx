'use client'

import { JobCard } from "@/components/JobCard";
import { useGetJobsQuery } from "@/lib/queries/jobs";

export default function JobBoard() {
  const {data, isLoading, isError} = useGetJobsQuery();

  // Filter for only active jobs
  const activeJobs = data?.filter(job => job.isActive) || [];

  return (
    <div className="w-full h-full flex flex-col gap-4">
      <h1 className="font-bold text-4xl text-ma-red">MA Job Board</h1>

      {isLoading ? (
        <p>Loading jobs...</p>
      ) : activeJobs.length > 0 ? (
        activeJobs.map((job, idx) => <JobCard job={job} key={idx}/>)
      ) : (
        <p className="text-muted-foreground">No active jobs available at the moment.</p>
      )}
    </div>
  )
}