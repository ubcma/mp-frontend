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
import { fetchExportUsers } from '@/lib/queries/export';
import { Role } from '@/lib/types';
import { ChevronDown, Download } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import SearchBar from '@/components/SearchBar';
import { useSearchParams } from 'next/navigation';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Home() {
  // Pagination + filter state
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const [roleFilter, setRoleFilter] = useState<Role | 'All Roles'>('All Roles');
  const [exportMode, setExportMode] = useState<'all' | 'page'>('all');
  const [isClient, setIsClient] = useState(false);

  const searchParams = useSearchParams();
  const search = searchParams.get('search') || '';

  useEffect(() => setIsClient(true), []);

  // Reset pagination when filters change
  useEffect(() => setPage(1), [roleFilter, search]);

  // Fetch users
  const { data, isLoading, error } = useGetAllUsersQuery(
    page,
    pageSize,
    roleFilter,
    search.toLowerCase()
  );

  const users = data?.data ?? [];
  const totalPages = data?.meta?.totalPages ?? 1;
  const totalCount = data?.meta?.totalCount ?? 0;

  const ROLES = ['All Roles', 'Basic', 'Member', 'Admin'] as const;

  const handleExport = async (type: 'page' | 'all') => {
    await fetchExportUsers({
      exportType: type,
      page,
      pageSize,
      role: roleFilter,
      search,
    });
  };

  if (isLoading) return <div>Loading members...</div>;
  if (error) return <div>Error loading users.</div>;

  return (
    <div className="w-full max-w-full overflow-x-hidden space-y-4">
      <div className="font-semibold text-2xl mb-4">Manage All Members</div>

      <div className='flex flex-wrap md:justify-between gap-4'>
        <div className="flex items-center gap-2">
          {/* Search */}
          <SearchBar
            placeholder="Search by name or email..."
            searchParamKey="search"
          />
          {/* Role Filter */}
          <Select
            value={roleFilter}
            onValueChange={(value: Role | 'All Roles') => setRoleFilter(value)}
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
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600">
              <Download size={16} />
              Download CSV
              <ChevronDown size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start">
            <DropdownMenuItem onClick={() => handleExport('page')}>
              This Page
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleExport('all')}>
              All Results
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Table */}
      <div className="relative overflow-x-auto">
        <DataTable columns={membersColumns} data={users} />
      </div>

      {/* Pagination Controls */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, totalCount)} of {totalCount} results (Page{' '}
          {page} of {totalPages})
        </div>

        <div className="flex items-center space-x-4">
          {/* Page size */}
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

          {/* Prev / Next */}
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
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
