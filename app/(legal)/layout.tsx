import { AuthPageGradient } from "@/components/BackgroundGradients";

export default function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className="
        flex justify-center items-center w-full md:relative
      "
    >
      {/* Background Gradient */}
      <AuthPageGradient />

      {/* Auth Content */}
      <div
        className="
          w-screen
          flex flex-col justify-center items-center
          bg-background/60 bg-blend-hard-light backdrop-blur-xl
          md:border border-background/80
          shadow-[inset_0px_0px_80px_20px_rgba(255,255,255,0.1)]
          dark:shadow-[inset_0px_0px_80px_20px_rgba(0,0,0,0.1)]
        "
      >
        {children}
      </div>
    </div>
  );
}