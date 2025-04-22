'use client';

import { useLogoutMutation } from '@/lib/mutations/auth';
import { Button } from './ui/button';
import { LogOut } from 'lucide-react';

export function LogoutButton() {
  const logoutMutation = useLogoutMutation();

  return (
    <Button
      onClick={() => logoutMutation.mutate()}
      disabled={logoutMutation.isPending}
      className="p-2 rounded-md bg- text-white"
    >
      {logoutMutation.isPending ? (
        'Logging out...'
      ) : (
        <div>
          <LogOut className="h-4 w-4" />
          'Logout'
        </div>
      )}
    </Button>
  );
}
