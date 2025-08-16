'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';
import { useUserQuery } from '@/lib/queries/user';

export default function Home() {
  const { data: user} = useUserQuery();
  const router = useRouter();

  const userFirstName = user?.name.split(' ')[0];

  return (
    <div className="flex flex-col justify-center w-full h-full">

      <div className="flex flex-col gap-2">
        <span className="flex flex-row text-3xl font-semibold">
          {userFirstName ? (
            `Welcome back, ${userFirstName}!`
          ) : (
            <Skeleton className="h-8 w-32 rounded-xl" />
          )}
        </span>
        <p className="text-muted-foreground">
          Check out the latest events, workshops, and opportunities we have for
          you.
        </p>
      </div>
    </div>
  );
}
