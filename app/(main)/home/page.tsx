'use client';

import { useUserQuery } from '@/lib/queries/user';

export default function Home() {
  const { data: user, isLoading, isError } = useUserQuery();

  const userName = user?.name || 'User';

  return (
    <div className="flex flex-col justify-center w-full h-full">
      <div className='flex flex-col gap-2'>
        <p className="text-3xl font-semibold">
          Welcome {userName.split(' ')[0]}!
        </p>
        <p className="text-muted-foreground">
          Check out the latest events, workshops, and opportunities we have for
          you.
        </p>
      </div>
    </div>
  );
}
