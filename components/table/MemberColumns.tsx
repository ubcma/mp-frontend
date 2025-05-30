'use client';

import { UserProfileData } from '@/lib/types';
import { ColumnDef } from '@tanstack/react-table';

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
];
