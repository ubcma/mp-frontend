import { ColumnDef } from '@tanstack/react-table';
import {
  EventRegistration,
  EventQuestion,
} from '@/lib/types/eventRegistration';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, User, Mail, Phone, GraduationCap } from 'lucide-react';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { fetchFromAPI } from '@/lib/httpHandlers';
import { handleClientError } from '@/lib/error/handleClient';
import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { useQueryClient } from '@tanstack/react-query';

interface RegistrationStatusDropdownProps {
  userRegistration: any;
  eventId: string;
}

export default function RegistrationStatusDropdown({
  userRegistration,
  eventId,
}: RegistrationStatusDropdownProps) {
  const [status, setStatus] = useState(userRegistration.status);
  const queryClient = useQueryClient();

  async function handleStatusChange(newStatus: string) {
    try {
      const res = await fetchFromAPI(
        `/api/events/${eventId}/registrations/${userRegistration.id}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
          body: { status: newStatus },
        }
      );

      if (!res.ok) {
        throw new Error('Failed to update status');
      }

      setStatus(newStatus);

      queryClient.invalidateQueries({
        queryKey: ['event-registrations', eventId],
      });

      toast.success('Status updated!');
    } catch (err: unknown) {
      handleClientError('Error', err);
    }
  }

  return (
    <Select
  value={status}
  onValueChange={(newStatus) => handleStatusChange(newStatus)}
>
  <SelectTrigger
    className={`w-full rounded-full px-4 py-2 text-center font-medium border-none ${
      status === 'checkedIn'
        ? 'bg-emerald-200 text-emerald-900'
        : status === 'registered'
        ? 'bg-blue-200 text-blue-900'
        : status === 'incomplete'
        ? 'bg-rose-200 text-rose-900'
        : 'bg-neutral-200 text-neutral-900'
    }`}
  >
    <SelectValue placeholder="Select status" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem
      value="registered"
    >
      Registered
    </SelectItem>
    <SelectItem
      value="checkedIn"
    >
      Checked-in
    </SelectItem>
    <SelectItem
      value="incomplete"
    >
      Incomplete
    </SelectItem>
  </SelectContent>
</Select>
  );
}

export const registrationsColumns = (
  questions: EventQuestion[],
  eventId: string
): ColumnDef<EventRegistration>[] => [
  // User Info Section
  {
    accessorKey: 'userName',
    header: 'Name',
    cell: ({ row }) => {
      const registration = row.original;
      const displayName =
        registration.userName ||
        `${registration.firstName || ''} ${registration.lastName || ''}`.trim() ||
        'Unknown User';

      return (
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <div>
            <div className="font-medium">{displayName}</div>
            {registration.userEmail && (
              <div className="text-sm text-gray-500">
                {registration.userEmail}
              </div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'status',
    header: 'Reg. Status',
    cell: ({ row }) => {
      return (
        <RegistrationStatusDropdown
          userRegistration={row.original}
          eventId={eventId}
        />
      );
    },
  },
  {
    accessorKey: 'studentNumber',
    header: 'Student #',
    cell: ({ row }) => {
      const studentNumber = row.original.studentNumber;
      return studentNumber ? (
        <Badge variant="outline">{studentNumber}</Badge>
      ) : (
        <span className="text-gray-400">-</span>
      );
    },
  },
  {
    accessorKey: 'faculty',
    header: 'Faculty',
    cell: ({ row }) => {
      const faculty = row.original.faculty;
      const yearOfStudy = row.original.yearOfStudy;

      return (
        <div className="flex items-center space-x-1">
          <GraduationCap className="h-4 w-4 text-gray-500" />
          <div>
            {faculty && <div className="text-sm">{faculty}</div>}
            {yearOfStudy && (
              <div className="text-xs text-gray-500">Year {yearOfStudy}</div>
            )}
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Contact',
    cell: ({ row }) => {
      const phone = row.original.phoneNumber;
      const email = row.original.userEmail;

      return (
        <div className="space-y-1">
          {phone && (
            <div className="flex items-center space-x-1 text-sm">
              <Phone className="h-3 w-3 text-gray-500" />
              <span>{phone}</span>
            </div>
          )}
          {email && (
            <div className="flex items-center space-x-1 text-sm">
              <Mail className="h-3 w-3 text-gray-500" />
              <span className="truncate max-w-[150px]">{email}</span>
            </div>
          )}
        </div>
      );
    },
  },
  // Dynamic columns for custom questions
  ...questions.map(
    (question): ColumnDef<EventRegistration> => ({
      id: `question_${question.id}`,
      header: question.label,
      cell: ({ row }) => {
        const response = row.original.responses[question.label];

        if (!response) {
          return <span className="text-gray-400">-</span>;
        }

        // Handle different response types
        if (question.type === 'YesNo') {
          return (
            <Badge
              variant={
                response.toLowerCase() === 'yes' ? 'default' : 'secondary'
              }
            >
              {response}
            </Badge>
          );
        }

        if (question.type === 'Checkbox' && question.options) {
          // Handle multiple selections
          const selections = response.split(',').map((s) => s.trim());
          return (
            <div className="flex flex-wrap gap-1">
              {selections.map((selection, idx) => (
                <Badge key={idx} variant="outline" className="text-xs">
                  {selection}
                </Badge>
              ))}
            </div>
          );
        }

        // For long text, truncate and show tooltip on hover
        if (question.type === 'LongText' && response.length > 50) {
          return (
            <div className="max-w-[200px]">
              <span className="truncate block" title={response}>
                {response.substring(0, 50)}...
              </span>
            </div>
          );
        }

        return <span className="text-sm">{response}</span>;
      },
    })
  ),
  // Registration Details
  {
    accessorKey: 'registeredAt',
    header: 'Registered',
    cell: ({ row }) => {
      const date = new Date(row.original.registeredAt);
      return (
        <div className="text-sm">
          <div>{format(date, 'MMM dd, yyyy')}</div>
          <div className="text-gray-500">{format(date, 'h:mm a')}</div>
        </div>
      );
    },
  },
  {
    accessorKey: 'stripeTransactionId',
    header: 'Payment',
    cell: ({ row }) => {
      const transactionId = row.original.stripeTransactionId;
      return transactionId ? (
        <Badge variant="default" className="bg-green-100 text-green-800">
          Paid
        </Badge>
      ) : (
        <Badge variant="outline">Free</Badge>
      );
    },
  },
  // Actions
  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const registration = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(registration.userEmail);
                toast.success('Copied email to clipboard!');
              }}
            >
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigator.clipboard.writeText(registration.id.toString());
                toast.success('Copied registration ID to clipboard!');
              }}
            >
              Copy registration ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View details</DropdownMenuItem>
            <DropdownMenuItem>Edit registration</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600">
              Remove registration
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
