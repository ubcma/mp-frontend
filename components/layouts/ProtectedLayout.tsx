// app/(protected)/layout.tsx
import { getServerSession } from "@/lib/auth-server";
import { redirect } from "next/navigation";

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const res = await getServerSession();

  if (!res.ok) {
    redirect("/sign-in");
  }

  const session = await res.json();

  if (!session?.user) {
    redirect("/sign-in");
  }

  return <>{children}</>;
}