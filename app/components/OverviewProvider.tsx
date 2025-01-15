"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Overview from "./Overview";

export default function OverviewProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isOverviewOpen, setIsOverviewOpen] = useState(false);

  useEffect(() => {
    // Show modal when on `/overview`
    if (pathname === "/overview") {
      setIsOverviewOpen(true);
    } else {
      setIsOverviewOpen(false);
    }
  }, [pathname]);

  return (
    <>
      {children}
      {isOverviewOpen && (
        <Overview onClose={() => setIsOverviewOpen(false)}>
          <div>good morning</div>
        </Overview>
      )}
    </>
  );
}
