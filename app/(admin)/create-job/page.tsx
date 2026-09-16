'use client';

import JobForm from '@/components/forms/JobForm';
import { useCreateJobMutation } from '@/lib/queries/jobs';
import type { CreateJobInput } from '@/lib/types/job';

export default function CreateJobPage() {
  const createJobMutation = useCreateJobMutation();

  const handleSubmit = async (values: CreateJobInput) => {
    await createJobMutation.mutateAsync(values);
  };

  return (
    <div className="container mx-auto py-8">
      <JobForm mode="create" onSubmit={handleSubmit} />
    </div>
  );
}