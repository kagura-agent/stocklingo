"use client";

import Link from "next/link";
import { useAuth } from "./AuthProvider";

export default function UserMenu() {
  const { user, loading, enabled } = useAuth();

  if (!enabled) return null;
  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-duo-gray-200 dark:bg-slate-700 animate-pulse" />
    );
  }

  if (!user) {
    return (
      <Link
        href="/auth/login"
        className="rounded-xl bg-duo-green px-3 py-1.5 text-sm font-bold text-white transition-all active:scale-95"
      >
        登录
      </Link>
    );
  }

  const avatarUrl = user.user_metadata?.avatar_url;
  const name = user.user_metadata?.full_name || user.email?.split("@")[0] || "用户";

  return (
    <Link href="/profile" className="flex items-center gap-2">
      {avatarUrl ? (
        <img
          src={avatarUrl}
          alt={name}
          className="h-8 w-8 rounded-full border-2 border-duo-green"
        />
      ) : (
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-duo-green text-sm font-bold text-white">
          {name[0].toUpperCase()}
        </div>
      )}
    </Link>
  );
}
