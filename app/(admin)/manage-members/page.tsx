'use client';

import { membersColumns } from '@/components/table/MemberColumns';
import { DataTable } from '@/components/ui/data-table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetAllUsersQuery } from '@/lib/queries/users';
import { Role } from '@/lib/types';
import { Download } from 'lucide-react';
import { useState } from 'react';
import { CSVLink, CSVDownload } from 'react-csv';

export default function Home() {
  const { data: users, isLoading, error } = useGetAllUsersQuery();

  const [roleFilter, setRoleFilter] = useState<Role | 'All Roles'>('All Roles');

  const ROLES = ['All Roles', 'Basic', 'Member', 'Admin'] as const;

  const filteredUsers =
    roleFilter === 'All Roles'
      ? users
      : users?.filter((user) => user.role === roleFilter);

  const headers = [
    { label: 'Name', key: 'name' },
    { label: 'Email', key: 'email' },
    { label: 'Role', key: 'role' },
    { label: 'Bio', key: 'bio' },
    { label: 'Avatar', key: 'avatar' },
    { label: 'Year', key: 'year' },
    { label: 'Faculty', key: 'faculty' },
    { label: 'Major', key: 'major' },
    { label: 'LinkedIn', key: 'linkedinUrl' },
    { label: 'Diet', key: 'diet' },
    { label: 'Interests', key: 'interests' },
    { label: 'Onboarding Complete', key: 'onboardingComplete' },
  ];

  const csvData = filteredUsers?.map((user) => ({
    ...user,
    diet: user.diet?.join(', ') || '',
    interests: user.interests?.join(', ') || '',
    onboardingComplete: user.onboardingComplete ? 'Yes' : 'No',
  }));

  return (
    <div className='space-y-4'>
      <div className="font-semibold text-2xl mb-4">Manage All Members</div>
      <Select
        value={roleFilter}
        onValueChange={(value: Role | 'All Roles') => setRoleFilter(value)}
      >
        <SelectTrigger className="w-[140px]" >
          <SelectValue placeholder="Filter by role" />
        </SelectTrigger>
        <SelectContent>
          {ROLES.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <DataTable columns={membersColumns} data={filteredUsers || []} />
      <CSVLink
        data={csvData || []}
        headers={headers}
        filename="ubcma_portal_users.csv"
        className="text-sm flex flex-row w-fit gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
      >
        <Download size={16}/>
        Download CSV
      </CSVLink>
    </div>
  );
}
