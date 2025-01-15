"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Settings from "./Settings";

export default function SettingsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  useEffect(() => {
    // Show modal when on `/settings`
    if (pathname === "/settings") {
      setIsSettingsOpen(true);
    } else {
      setIsSettingsOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {children}
    </>
  );
}
