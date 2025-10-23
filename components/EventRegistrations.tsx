'use client';

import { DataTable } from '@/components/ui/data-table';
import { useGetEventRegistrationsQuery } from '@/lib/queries/registrations';
import { registrationsColumns } from '@/components/table/RegistrationColumns';
import Spinner from './common/Spinner';
import { useEffect, useState } from 'react';
import { Input } from './ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { CSVLink } from 'react-csv';
import { Download } from 'lucide-react';
import { EventRegistration } from '@/lib/types/eventRegistration';

interface EventRegistrationsProps {
  eventId: string;
  eventTitle: string;
}

export default function EventRegistrations({
  eventId,
  eventTitle,
}: EventRegistrationsProps) {
  const { data, isLoading, error } = useGetEventRegistrationsQuery(eventId);
  const [searchQuery, setSearchQuery] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [exportMode, setExportMode] = useState<'all' | 'page'>('all');
  const [isClient, setIsClient] = useState(false);
  const [csvFilename, setCsvFilename] = useState('event_registrations.csv');

  useEffect(() => setIsClient(true), []);

  // Generate CSV filename dynamically (client-side)
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCsvFilename(`event_registrations_${eventId}_${exportMode}_${today}.csv`);
  }, [exportMode, eventId]);

  if (isLoading) return <Spinner />;

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <h3 className="text-red-800 font-medium">
            Error loading registrations
          </h3>
          <p className="text-red-600 text-sm mt-1">
            Failed to load event registrations. Please try again later.
          </p>
        </div>
      </div>
    );
  }

  const registrations = data?.registrations || [];
  const questions = data?.questions || [];

  // Filter
  const filteredRegistrations = registrations.filter((r) => {
    const q = searchQuery.toLowerCase();
    return (
      r?.userName?.toLowerCase().includes(q) ||
      r?.userEmail?.toLowerCase().includes(q)
    );
  });

  // Pagination logic
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const totalPages = Math.ceil((filteredRegistrations?.length || 0) / pageSize);
  const paginatedRegistrations = filteredRegistrations?.slice(
    startIndex,
    endIndex
  );

  // CSV headers
  const headers = [
    { label: 'ID', key: 'id' },
    { label: 'User ID', key: 'userId' },
    { label: 'Event ID', key: 'eventId' },
    { label: 'Stripe Transaction ID', key: 'stripeTransactionId' },
    { label: 'Status', key: 'status' },
    { label: 'Registered At', key: 'registeredAt' },
    { label: 'Email', key: 'userEmail' },
    { label: 'First Name', key: 'firstName' },
    { label: 'Last Name', key: 'lastName' },
    { label: 'User Name', key: 'userName' },
    { label: 'Student Number', key: 'studentNumber' },
    { label: 'Year of Study', key: 'yearOfStudy' },
    { label: 'Faculty', key: 'faculty' },
    { label: 'Phone Number', key: 'phoneNumber' },
  ];

  // Format CSV data
  function formatCsvData(
    registrations: EventRegistration[] = []
  ): Record<string, string | number | null>[] {
    return registrations.map((r) => {
      const {
        id,
        userId,
        eventId,
        stripeTransactionId,
        status,
        registeredAt,
        userEmail,
        userName,
        firstName,
        lastName,
        studentNumber,
        yearOfStudy,
        faculty,
        phoneNumber,
        responses,
      } = r;

      const flatResponses = Object.fromEntries(
        Object.entries(responses ?? {}).map(([key, value]) => [
          key,
          String(value),
        ])
      );

      return {
        id,
        userId,
        eventId,
        stripeTransactionId,
        status,
        registeredAt: new Date(registeredAt).toLocaleString(),
        userEmail,
        userName,
        firstName,
        lastName,
        studentNumber,
        yearOfStudy,
        faculty,
        phoneNumber,
        ...flatResponses,
      };
    });
  }

  return (
    <div className="my-8 space-y-6">
      <div>
        <h1 className="font-semibold text-2xl mb-2">
          Event Registrations: {eventTitle}
        </h1>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span>Total Registrations: {registrations.length}</span>
          <span>Custom Questions: {questions.length}</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row md:justify-between gap-4">
        <Input
          type="text"
          placeholder="Search by name or email"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full"
        />

        <div className="flex items-center gap-2 w-fit">
          <Select
            value={exportMode}
            onValueChange={(value) => setExportMode(value as 'all' | 'page')}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Export scope" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="page">This Page</SelectItem>
              <SelectItem value="all">All Results</SelectItem>
            </SelectContent>
          </Select>

          {isClient && (
            <CSVLink
              data={
                exportMode === 'page'
                  ? formatCsvData(paginatedRegistrations)
                  : formatCsvData(filteredRegistrations)
              }
              headers={headers}
              filename={csvFilename}
              className="flex flex-row text-nowrap w-fit gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors text-sm"
            >
              <Download size={16} />
              Download CSV
            </CSVLink>
          )}
        </div>
      </div>

      {/* Data table */}
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
          data={paginatedRegistrations}
        />
      )}

      {/* Pagination controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {startIndex + 1}-
          {Math.min(endIndex, filteredRegistrations?.length || 0)} of{' '}
          {filteredRegistrations?.length || 0} results (Page {page} of{' '}
          {totalPages})
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Rows per page:
            </span>
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => {
                setPageSize(Number(value));
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[80px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 15, 25, 50].map((size) => (
                  <SelectItem key={size} value={size.toString()}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
