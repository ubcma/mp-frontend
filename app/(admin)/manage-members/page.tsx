"use client"

import { membersColumns } from "@/components/table/MemberColumns";
import { DataTable } from "@/components/ui/data-table";
import { useGetAllUsersQuery } from "@/lib/queries/users";

export default function Home() {

  const { data: users, isLoading, error } = useGetAllUsersQuery();

  return (
    <div>
      <div className="font-semibold text-2xl mb-4">
        Manage All Members
      </div>
      <DataTable
        columns={membersColumns}
        data={users || []}
        />
    </div>
  );
}
