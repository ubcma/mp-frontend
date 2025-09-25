'use client'

import { JobCard } from "@/components/JobCard";
import { useGetJobsQuery } from "@/lib/queries/jobs";

export default function JobBoard() {

  const {data, isLoading, isError} = useGetJobsQuery();

  return (
    <div className="w-full h-full flex flex-col gap-4">

      <h1 className="font-bold text-4xl"> MA Job Board</h1>

      {data?.map((job, idx) => <JobCard job={job} key={idx}/>)}
    </div>
  )

}