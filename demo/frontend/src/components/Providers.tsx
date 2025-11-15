'use client';

import { ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";

const Providers = ({ children }: { children: ReactNode }) => (
  <>
    {children}
    <Toaster />
    <Sonner position="top-right" closeButton />
  </>
);

export default Providers;
