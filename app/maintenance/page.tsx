'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function MaintenancePage() {
  const [code, setCode] = useState('');
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const res = await fetch('/api/access', {
      method: 'POST',
      body: JSON.stringify({ code }),
      headers: { 'Content-Type': 'application/json' },
    });

    if (res.ok) {
      router.push('/sign-in');
    } else {
      toast.error('Invalid access code');
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-2 -mt-8 w-full px-8 text-center">
      <Image src="/logos/logo_red.svg" width={164} height={164} alt="MA Logo"/>
      <h1 className="text-xl font-semibold">UBC Marketing Association</h1>
      <p className="text-sm text-muted-foreground">
        {
          "Enter the access code to access the Membership Portal staging site."
        }
      </p>
      <form onSubmit={handleSubmit} className="flex flex-row gap-2 mt-2">
        <Input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter access code"
        />
        <Button
          type="submit"
          className="bg-ma-red hover:bg-ma-red/80 text-white"
        >
          <ArrowRight className="w-4 h-4" />
        </Button>
      </form>
    </div>
  );
}
