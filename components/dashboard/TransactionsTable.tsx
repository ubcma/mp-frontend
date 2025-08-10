'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  VisibilityState,
} from '@tanstack/react-table';
import { ArrowUpDown, ChevronDown, MoreHorizontal } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export const payments: Payment[] = [
  {
    transaction_id: "txn_001",
    user_id: "user_001",
    user_name: "Alice Johnson",
    user_email: "alice.johnson@example.com",
    purchase_type: "event",
    event_id: "event_101",
  },
  {
    transaction_id: "txn_002",
    user_id: "user_002",
    user_name: "Ben Carter",
    user_email: "ben.carter@example.com",
    purchase_type: "membership",
    event_id: "",
  },
  {
    transaction_id: "txn_003",
    user_id: "user_003",
    user_name: "Carla Wang",
    user_email: "carla.wang@example.com",
    purchase_type: "event",
    event_id: "event_102",
  },
  {
    transaction_id: "txn_004",
    user_id: "user_004",
    user_name: "David Lee",
    user_email: "david.lee@example.com",
    purchase_type: "event",
    event_id: "event_103",
  },
  {
    transaction_id: "txn_005",
    user_id: "user_005",
    user_name: "Emma Brown",
    user_email: "emma.brown@example.com",
    purchase_type: "membership",
    event_id: "",
  },
  {
    transaction_id: "txn_006",
    user_id: "user_006",
    user_name: "Frank Zhang",
    user_email: "frank.zhang@example.com",
    purchase_type: "event",
    event_id: "event_101",
  },
  {
    transaction_id: "txn_007",
    user_id: "user_007",
    user_name: "Grace Kim",
    user_email: "grace.kim@example.com",
    purchase_type: "event",
    event_id: "event_104",
  },
  {
    transaction_id: "txn_008",
    user_id: "user_008",
    user_name: "Henry Patel",
    user_email: "henry.patel@example.com",
    purchase_type: "membership",
    event_id: "",
  },
  {
    transaction_id: "txn_009",
    user_id: "user_009",
    user_name: "Isla Smith",
    user_email: "isla.smith@example.com",
    purchase_type: "event",
    event_id: "event_105",
  },
  {
    transaction_id: "txn_010",
    user_id: "user_010",
    user_name: "Jack Nguyen",
    user_email: "jack.nguyen@example.com",
    purchase_type: "event",
    event_id: "event_101",
  },
  {
    transaction_id: "txn_011",
    user_id: "user_011",
    user_name: "Kara Davis",
    user_email: "kara.davis@example.com",
    purchase_type: "membership",
    event_id: "",
  },
  {
    transaction_id: "txn_012",
    user_id: "user_012",
    user_name: "Leo Tanaka",
    user_email: "leo.tanaka@example.com",
    purchase_type: "event",
    event_id: "event_103",
  },
  {
    transaction_id: "txn_013",
    user_id: "user_013",
    user_name: "Mia Lopez",
    user_email: "mia.lopez@example.com",
    purchase_type: "event",
    event_id: "event_105",
  },
  {
    transaction_id: "txn_014",
    user_id: "user_014",
    user_name: "Noah Wilson",
    user_email: "noah.wilson@example.com",
    purchase_type: "membership",
    event_id: "",
  },
  {
    transaction_id: "txn_015",
    user_id: "user_015",
    user_name: "Olivia Chen",
    user_email: "olivia.chen@example.com",
    purchase_type: "event",
    event_id: "event_102",
  },
  {
    transaction_id: "txn_016",
    user_id: "user_016",
    user_name: "Peter Adams",
    user_email: "peter.adams@example.com",
    purchase_type: "event",
    event_id: "event_104",
  },
]

export type Payment = {
  transaction_id: string;
  user_id: string;
  user_name: string;
  user_email: string;
  purchase_type: 'event' | 'membership';
  event_id: string;
};

function SortableHeader({
  column,
  label,
}: {
  column: any
  label: string
}) {
  return (
    <Button
      variant="ghost"
      onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
    >
      {label}
      <ArrowUpDown className="ml-2 h-4 w-4" />
    </Button>
  )
}

const Cell = {
  mono: (value: string) => (
    <div className="font-mono text-xs truncate max-w-[150px]">{value}</div>
  ),
  email: (value: string) => <div className="lowercase">{value}</div>,
  capital: (value: string) => <div className="capitalize">{value}</div>,
  optional: (value: string) =>
    value ? <div className="font-mono text-xs">{value}</div> : <span className="italic text-muted-foreground">n/a</span>,
}

export const columns: ColumnDef<Payment>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "transaction_id",
    header: "Transaction ID",
    cell: ({ row }) => Cell.mono(row.getValue("transaction_id")),
  },
  {
    accessorKey: "user_name",
    header: "Name",
  },
  {
    accessorKey: "user_email",
    header: ({ column }) => <SortableHeader column={column} label="Email" />,
    cell: ({ row }) => Cell.email(row.getValue("user_email")),
  },
  {
    accessorKey: "purchase_type",
    header: "Type",
    cell: ({ row }) => Cell.capital(row.getValue("purchase_type")),
  },
  {
    accessorKey: "event_id",
    header: "Event ID",
    cell: ({ row }) => Cell.optional(row.getValue("event_id")),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original
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
              onClick={() =>
                navigator.clipboard.writeText(payment.transaction_id)
              }
            >
              Copy transaction ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]


export default function TransactionsTable() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable<Payment>({
    data: payments,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter emails..."
          value={(table.getColumn('user_email')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('user_email')?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                    onSelect={(e) => e.preventDefault()}
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
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
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-muted-foreground flex-1 text-sm">
          {table.getFilteredSelectedRowModel().rows.length} of{' '}
          {table.getFilteredRowModel().rows.length} row(s) selected.
        </div>
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}
