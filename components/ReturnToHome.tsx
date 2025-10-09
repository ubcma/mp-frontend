import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';

export default function ReturnToHomeButton() {
  return (
    <Link
      className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-700 transition-colors"
      href="/home"
    >
      <ChevronLeft className="w-4 h-4" />
      <span>Back to Home</span>
    </Link>
  );
}
