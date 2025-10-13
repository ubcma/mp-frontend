'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useGetJobsQuery } from '@/lib/queries/jobs';
import { AdminJobCard } from '@/components/AdminJobCard';
import Spinner from '@/components/common/Spinner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function ManageJobsPage() {
  const { data: jobs, isLoading } = useGetJobsQuery();
  const router = useRouter();

  function onEdit(id: string) {
    router.push(`/admin/jobs/edit/${id}`);
  }

  return (
    <div className="container mx-auto py-8">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Manage Jobs</h1>
          <p className="text-muted-foreground text-sm mt-1">
            View, edit, and manage all job postings
          </p>
        </div>
        <Button
          onClick={() => router.push('/create-job')}
          className="bg-ma-red hover:bg-red-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Job
        </Button>
      </div>

      {/* Jobs Grid */}
      <div className="grid md:grid-cols-2 grid-cols-1 gap-4 md:mt-0 mt-4">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-12">
            <Spinner />
          </div>
        ) : jobs && jobs.length > 0 ? (
          jobs?.map((job, index) => (
            <AdminJobCard key={job.id || index} job={job} onEdit={onEdit} />
          ))
        ) : (
          <div className="col-span-full flex flex-col justify-center items-center w-full h-full text-center py-12">
            <img
              src="/no_results_found.svg"
              alt="No jobs found"
              className="w-24 h-24 mb-4"
            />
            <h3 className="text-lg font-semibold">No jobs created.</h3>
            <p className="text-muted-foreground text-sm max-w-96 mt-2">
              {"Looks like you haven't created any job postings yet. You can start by "}
              <Link
                href="/admin/create-job"
                className="font-semibold text-blue-500"
              >
                creating a new job posting
              </Link>
              .
            </p>
          </div>
        )}
      </div>
    </div>
  );
}