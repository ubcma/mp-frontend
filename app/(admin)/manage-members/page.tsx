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
import { useState, useEffect } from 'react';
import { CSVLink } from 'react-csv';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';

export default function Home() {
  // pagination + filter states
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [roleFilter, setRoleFilter] = useState<Role | 'All Roles'>('All Roles');
  const [exportMode, setExportMode] = useState<'all' | 'page'>('all');
  const [isClient, setIsClient] = useState(false);
  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => setIsClient(true), []);

  useEffect(() => {
    setPage(1);
  }, [roleFilter, search]);

  const { data, isLoading, error } = useGetAllUsersQuery(
    page,
    pageSize,
    roleFilter,
    search.toLowerCase()
  );

  const users = data?.data ?? [];
  const pagination = data?.meta;
  const totalPages = pagination?.totalPages ?? 1;
  const totalCount = pagination?.totalCount ?? 0;

  const ROLES = ['All Roles', 'Basic', 'Member', 'Admin'] as const;
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

  const [csvFilename, setCsvFilename] = useState('ubcma_members.csv');
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setCsvFilename(`ubcma_members_${exportMode}_${today}.csv`);
  }, [exportMode]);

  const formatCsvData = (users: any[] = []) =>
    users.map((user) => ({
      ...user,
      diet: user.diet?.join(', ') || '',
      interests: user.interests?.join(', ') || '',
      onboardingComplete: user.onboardingComplete ? 'Yes' : 'No',
    }));

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error loading users.</div>;

  return (
    <div className="space-y-4">
      <div className="font-semibold text-2xl mb-4">Manage All Members</div>

      <Select
        value={roleFilter}
        onValueChange={(value: Role | 'All Roles') => {
          setRoleFilter(value);
        }}
      >
        <SelectTrigger className="w-[140px]">
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


      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, totalCount)} of {totalCount} results (Page{' '}
          {page} of {totalPages})
        </div>

        <div className="flex items-center space-x-4">

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">Rows per page:</span>
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


      <SearchBar
        placeholder="Search by name or email..."
        searchParamKey="search"
      />

      <DataTable columns={membersColumns} data={users} />

      <div className="flex items-center gap-2">
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
                ? formatCsvData(users)
                : formatCsvData(users)
            }
            headers={headers}
            filename={csvFilename}
            className="text-sm flex flex-row w-fit gap-2 items-center bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
          >
            <Download size={16} />
            Download CSV
          </CSVLink>
        )}
      </div>
    </div>
  );
}
