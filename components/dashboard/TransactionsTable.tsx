'use client';

import React, { useState } from 'react';
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Transaction, useTransactionsQuery } from '@/lib/queries/transactions';
import { TableSkeleton } from '../skeleton/Table';

export const columns: ColumnDef<Transaction>[] = [
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
    header: 'Paid At',
    cell: ({ row }) => (
      <div>{new Date(row.getValue('paidAt')).toLocaleString()}</div>
    ),
  },
];

export default function TransactionsTable() {
  const [page, setPage] = useState(1);
  const pageSize = 16;

  // Fetch paginated data using the custom hook
  const { data, isLoading, isError } = useTransactionsQuery(page, pageSize);

  console.log(data);

  const transactions = data?.data;
  const pagination = data?.meta;

  const table = useReactTable({
    data: data?.data || [], // Use the fetched data
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      {/* Table */}
      {!data ? (
        <TableSkeleton rows={pageSize} columns={columns.length}/>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
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
      {/* Pagination Controls */}
      <div className="flex items-center justify-between py-4">
        {/* Results Info */}
        <div className="text-sm text-muted-foreground">
          Showing {(page - 1) * (transactions?.length || 0)}-
          {(page - 1) * (transactions?.length || 0) + pageSize} of{' '}
          {pagination?.totalCount || 0} results (Page {pagination?.page || 1} of{' '}
          {pagination?.totalPages || 1})
        </div>

        {/* Pagination Buttons */}
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
