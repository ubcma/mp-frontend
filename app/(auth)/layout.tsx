import { AuthPageGradient } from "@/components/BackgroundGradients";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex justify-center items-center
        fixed top-0 left-0 w-full
        h-[100dvh] md:relative md:h-screen
        overflow-hidden overscroll-none
      "
    >
      {/* Background Gradient */}
      <AuthPageGradient />

      {/* Auth Content */}
      <div
        className="
          w-full md:w-fit
          flex flex-col justify-center items-center
          h-full md:h-fit
          md:px-12 px-8 py-12
          bg-background/60 bg-blend-hard-light backdrop-blur-xl
          md:border border-background/80 md:m-4 md:rounded-md
          shadow-[inset_0px_0px_80px_20px_rgba(255,255,255,0.1)]
          dark:shadow-[inset_0px_0px_80px_20px_rgba(0,0,0,0.1)]
        "
      >
        {children}
      </div>
    </div>
  );
}