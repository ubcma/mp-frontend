import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2">
      <h1 className="text-[8rem] md:text-[12rem] font-semibold bg-gradient-to-t from-transparent  to-ma-red inline-block text-transparent bg-clip-text leading-none">
        404
      </h1>
      <p className="text-xl text-foreground font-semibold">
        {'Oops, page not found!'}
      </p>
      <p className="text-sm text-muted-foreground">
        {'The page you are looking for does not exist.'}
      </p>
      <Link href="/home" className='mt-4' prefetch={true}>
        <Button variant='ma'> Return to Home </Button>
      </Link>
    </div>
  );
}
