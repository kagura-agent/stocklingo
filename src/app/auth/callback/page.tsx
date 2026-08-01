"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { downloadAndMerge } from "@/lib/sync";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === "SIGNED_IN" && session?.user) {
        await downloadAndMerge(supabase, session.user.id);
        router.push("/");
      }
    });
  }, [router]);

  return (
    <div className="flex min-h-[80vh] items-center justify-center">
      <p className="text-duo-gray-300 dark:text-slate-400">正在登录...</p>
    </div>
  );
}
