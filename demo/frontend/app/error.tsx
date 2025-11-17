'use client';

import { useEffect } from "react";
import Link from "next/link";
import { StatutaLogo } from "@/components/StatutaLogo";
import { Button } from "@/components/ui/button";

type ErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function Error({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-6 py-12 text-center text-foreground">
      <StatutaLogo className="mb-6 text-primary" />
      <p className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">Something went wrong</p>
      <h1 className="mb-6 text-3xl font-semibold">We couldn’t render this view</h1>
      <div className="flex flex-wrap justify-center gap-3">
        <Button onClick={() => reset()} variant="default">
          Try again
        </Button>
        <Button asChild variant="outline">
          <Link href="/">Back to start</Link>
        </Button>
      </div>
    </div>
  );
}

