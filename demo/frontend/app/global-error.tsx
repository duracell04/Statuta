'use client';

import { useEffect } from "react";
import Link from "next/link";
import { StatutaLogo } from "@/components/StatutaLogo";
import { Button } from "@/components/ui/button";

type GlobalErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function GlobalError({ error, reset }: GlobalErrorProps) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="bg-background">
        <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12 text-center text-foreground">
          <StatutaLogo className="mb-6 text-primary" />
          <p className="mb-2 text-sm uppercase tracking-wide text-muted-foreground">App crash detected</p>
          <h1 className="mb-6 text-3xl font-semibold">Statuta demo needs a refresh</h1>
          <div className="flex flex-wrap justify-center gap-3">
            <Button onClick={() => reset()} variant="default">
              Retry rendering
            </Button>
            <Button asChild variant="outline">
              <Link href="/">Go to home</Link>
            </Button>
          </div>
        </div>
      </body>
    </html>
  );
}

