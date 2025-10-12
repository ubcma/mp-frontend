'use client';

import { UserProfileData } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';
import { useUpdateUserMutation } from '@/lib/queries/users';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';


export const membersColumns: ColumnDef<UserProfileData>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'email',
    header: 'Email',
  },
  {
    accessorKey: 'role',
    header: 'Role',
  },
  {
    accessorKey: 'faculty',
    header: 'Faculty',
  },
  {
    accessorKey: 'major',
    header: 'Major',
  },
  {
    accessorKey: 'year',
    header: 'Year',
  },
  {
    accessorKey: 'linkedinUrl',
    header: 'LinkedIn',
  },
  {
    accessorKey: 'diet',
    header: 'Dietary Restrictions',
  },
  {
    accessorKey: 'interests',
    header: 'Interests',
  },

  {
    id: 'actions',
    header: 'Actions',
    cell: ({ row }) => {
      const user = row.original;
      const { mutate: updateUserRole } = useUpdateUserMutation();

      const handleRoleChange = (newRole: string) => {
        updateUserRole({ userId: user.userId, newRole });
      };

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
              navigator.clipboard.writeText(user.email);
              toast.success('Copied email!');
            }}
          >
            Copy email
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          {user.role !== 'Member' && (
            <DropdownMenuItem onClick={() => handleRoleChange('Member')}>
              Promote to Member
            </DropdownMenuItem>
          )}
          {user.role !== 'Basic' && (
            <DropdownMenuItem onClick={() => handleRoleChange('Basic')}>
              Revert to Basic
            </DropdownMenuItem>
          )}
          {user.role !== 'Admin' && (
            <DropdownMenuItem onClick={() => handleRoleChange('Admin')}>
              Promote to Admin
            </DropdownMenuItem>
          )}

          <DropdownMenuSeparator />
          <DropdownMenuItem className="text-red-600">
            Remove user
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  },
},
];
