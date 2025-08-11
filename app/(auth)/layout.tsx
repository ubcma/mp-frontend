import { AuthPageGradient } from '@/components/BackgroundGradients';
import Image from 'next/image';

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex items-center justify-center min-h-screen">
      {/* Background Gradient */}
      <AuthPageGradient/>

      {/* Right Content Panel */}
      <div
        className="w-full md:w-fit place-self-center flex flex-col justify-center items-center h-screen md:h-fit md:px-12 px-8 py-12 bg-background/60 bg-blend-hard-light backdrop-blur-xl md:border border-background/80 md:m-4 md:rounded-md
      shadow-[inset_0px_0px_80px_20px_rgba(255,255,255,0.1)] dark:shadow-[inset_0px_0px_80px_20px_rgba(0,0,0,0.1)]"
      >
        {children}
      </div>
    </div>
  );
}
