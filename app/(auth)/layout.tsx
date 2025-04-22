import Image from "next/image";

export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="relative flex flex-row min-h-screen bg-ma-red">
      <div className="hidden fixed left-0 top-0 bottom-0 w-1/2 p-8 lg:flex flex-col justify-between">
        <Image
          src="/logos/ma-logo-white.svg"
          width={128}
          height={128}
          alt="UBC MA Logo"
        />
        <div>
          <h2 className="font-medium text-md text-white">Membership Portal</h2>
          <p className="text-xs text-white">
            UBC's Only Marketing-Focused Club
          </p>
        </div>
      </div>

      {/* Right Content Panel */}
      <div className="w-full lg:w-1/2 lg:ml-[50%] px-16 py-24 bg-white lg:m-4 lg:rounded-lg shadow-[inset_4_4px_8px_rgba(0,0,0,0.25)]">
        {children}
      </div>
    </div>
  );
}
