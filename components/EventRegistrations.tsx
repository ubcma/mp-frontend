"use client"

import { DataTable } from "@/components/ui/data-table";
import { useGetEventRegistrationsQuery } from "@/lib/queries/registrations";
import { registrationsColumns } from "@/components/table/RegistrationColumns";
import Spinner from "./common/Spinner";
import { useState } from "react";
import { Input } from "./ui/input";

interface EventRegistrationsProps {
  eventId: string;
  eventTitle: string;
}

export default function EventRegistrations({ eventId, eventTitle }: EventRegistrationsProps) {
  const { data, isLoading, error } = useGetEventRegistrationsQuery(eventId);
  const [searchQuery, setSearchQuery] = useState("");

  if (isLoading) {
    return (
      <Spinner/>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">Error loading registrations</h3>
          <p className="text-red-600 text-sm mt-1">
            Failed to load event registrations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const registrations = data?.registrations || [];
  const questions = data?.questions || [];

  const filteredRegistrations = registrations.filter((registration) =>
    registration?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    registration?.userEmail?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="my-16">
      <div className="mb-6">
        <h1 className="font-semibold text-2xl mb-2">
          Event Registrations: {eventTitle}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total Registrations: {registrations.length}</span>
          <span>Custom Questions: {questions.length}</span>
        </div>
      </div>

      <div className="mb-6">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />
      </div>
      
      {registrations.length === 0 ? (
        <div className="text-center">
          <div className="bg-gray-50 rounded-lg p-16">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No registrations yet
            </h3>
            <p className="text-gray-500">
              This event doesn't have any registrations yet.
            </p>
          </div>
        </div>
      ) : (
        <DataTable
          columns={registrationsColumns(questions, eventId)}
          data={filteredRegistrations}
        />
      )}
    </div>
  );
}