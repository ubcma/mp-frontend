import { Button } from '@/components/ui/button';
import { getUserRole } from '@/lib/queries/server/userRole';
import Image from 'next/image';
import Link from 'next/link';

export default async function Membership() {
  const userRole = await getUserRole();

  let membershipStatus = '';

  switch (userRole) {
    case 'Basic':
      membershipStatus = 'Not a member';
      break;
    case 'Member':
      membershipStatus = 'UBCMA Member';
      break;
    case 'Admin':
      membershipStatus = 'UBCMA Executive';
      break;
    default:
      membershipStatus = 'Unavailable';
      break;
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[36rem] text-center">
      <Image
        alt="ma mascot"
        src="/logos/MA_mascot.png"
        width={320}
        height={320}
      />

      <p className="text-xl text-foreground font-semibold">
        {'Membership Status: '} {membershipStatus}
      </p>
      <p className="text-sm text-muted-foreground mt-2">
        {userRole === 'Member'
          ? 'Your membership status is confirmed. Thanks for being a part of the #MAFAM!'
          : userRole === 'Basic'
            ? `You aren't a member yet, click the button below to purchase a membership`
            : `Welcome to the portal!`}
      </p>
      {userRole === 'Basic' && (
        <Link href="/purchase-membership" className="mt-4" prefetch={true}>
          <Button variant="ma">Become a Member</Button>
        </Link>
      )}
    </div>
  );
}
