"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/admin/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#4A9EFF]"></div>
    </div>
  );
}
