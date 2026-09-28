'use client';

import React, { useEffect, useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  PurchaseTypeFilter,
  Transaction,
  TransactionSortOrder,
  useTransactionsQuery,
} from '@/lib/queries/transactions';
import { TableSkeleton } from '../skeleton/Table';

const MONTHS = [
  { value: 'all', label: 'All Months' },
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
] as const;

const PURCHASE_TYPES = [
  { value: 'all', label: 'All Types' },
  { value: 'membership', label: 'Membership' },
  { value: 'event', label: 'Event' },
] as const;

const FALLBACK_YEAR_OPTIONS = Array.from(
  { length: new Date().getFullYear() - 2019 },
  (_, i) => new Date().getFullYear() - i
);

function getColumns(
  sortOrder: TransactionSortOrder,
  onToggleSort: () => void
): ColumnDef<Transaction>[] {
  return [
    {
      accessorKey: 'id',
      header: 'Txid',
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[150px]">
          {row.getValue('id')}
        </div>
      ),
    },
    {
      accessorKey: 'userId',
      header: 'User ID',
      cell: ({ row }) => (
        <div className="font-mono text-xs truncate max-w-[150px]">
          {row.getValue('userId')}
        </div>
      ),
    },
    {
      accessorKey: 'email',
      header: 'Email',
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]">{row.getValue('email')}</div>
      ),
    },
    {
      accessorKey: 'userName',
      header: 'Name',
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]">{row.getValue('userName')}</div>
      ),
    },
    {
      accessorKey: 'purchaseType',
      header: 'Purchase Type',
      cell: ({ row }) => (
        <div className="capitalize">{row.getValue('purchaseType')}</div>
      ),
    },
    {
      accessorKey: 'eventId',
      header: 'Event ID',
      cell: ({ row }) => (
        <div className="truncate max-w-[150px]">
          {row.getValue('eventId') !== null ? row.getValue('eventId') : 'N/A'}
        </div>
      ),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => (
        <div className="text-green-600 font-medium">
          ${(parseInt(row.getValue('amount')) / 100).toFixed(2)}
        </div>
      ),
    },
    {
      accessorKey: 'currency',
      header: 'Currency',
      cell: ({ row }) => (
        <div className="uppercase">{row.getValue('currency')}</div>
      ),
    },
    {
      accessorKey: 'paidAt',
      header: () => (
        <Button
          variant="ghost"
          size="sm"
          className="-ml-3 h-8 data-[state=open]:bg-accent"
          onClick={onToggleSort}
        >
          Paid At
          {sortOrder === 'desc' ? (
            <ArrowDown className="ml-2 h-4 w-4" />
          ) : (
            <ArrowUp className="ml-2 h-4 w-4" />
          )}
        </Button>
      ),
      cell: ({ row }) => (
        <div>{new Date(row.getValue('paidAt')).toLocaleString()}</div>
      ),
    },
  ];
}

export default function TransactionsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 16;
  const [purchaseType, setPurchaseType] = useState<PurchaseTypeFilter>('all');
  const [year, setYear] = useState<number | null>(null);
  const [month, setMonth] = useState<number | null>(null);
  const [order, setOrder] = useState<TransactionSortOrder>('desc');

  useEffect(() => {
    setPage(1);
  }, [purchaseType, year, month, order]);

  const { data, isLoading, isError } = useTransactionsQuery(page, pageSize, {
    purchaseType,
    year,
    month,
    order,
  });

  const pagination = data?.meta;
  const yearOptions =
    pagination?.availableYears && pagination.availableYears.length > 0
      ? pagination.availableYears
      : FALLBACK_YEAR_OPTIONS;

  const columns = getColumns(order, () =>
    setOrder((prev) => (prev === 'desc' ? 'asc' : 'desc'))
  );

  const table = useReactTable({
    data: data?.data || [],
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <Select
          value={year?.toString() ?? 'all'}
          onValueChange={(value) =>
            setYear(value === 'all' ? null : Number(value))
          }
        >
          <SelectTrigger className="w-[130px]">
            <SelectValue placeholder="Year" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Years</SelectItem>
            {yearOptions.map((y) => (
              <SelectItem key={y} value={y.toString()}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={month?.toString() ?? 'all'}
          onValueChange={(value) =>
            setMonth(value === 'all' ? null : Number(value))
          }
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Month" />
          </SelectTrigger>
          <SelectContent>
            {MONTHS.map((m) => (
              <SelectItem key={m.value} value={m.value}>
                {m.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={purchaseType}
          onValueChange={(value: PurchaseTypeFilter) => setPurchaseType(value)}
        >
          <SelectTrigger className="w-[160px]">
            <SelectValue placeholder="Purchase type" />
          </SelectTrigger>
          <SelectContent>
            {PURCHASE_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!data ? (
        <TableSkeleton rows={pageSize} columns={columns.length} />
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader className="bg-ma-red/20">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Loading...
                  </TableCell>
                </TableRow>
              ) : isError ? (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Failed to load transactions.
                  </TableCell>
                </TableRow>
              ) : table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      )}

      <div className="flex items-center justify-between py-4">
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * pageSize + 1}-
          {Math.min(page * pageSize, pagination?.totalCount || 0)} of{' '}
          {pagination?.totalCount || 0} results (Page {pagination?.page || 1} of{' '}
          {pagination?.totalPages || 1})
        </div>

        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1 || isLoading}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setPage((prev) => Math.min(prev + 1, data?.meta?.totalPages || 1))
            }
            disabled={page === data?.meta?.totalPages || isLoading}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
