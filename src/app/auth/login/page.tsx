"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError(error.message);
      setLoading(false);
    } else {
      router.push("/");
      router.refresh();
    }
  }

  async function handleGitHub() {
    const supabase = createClient();
    await supabase.auth.signInWithOAuth({
      provider: "github",
      options: { redirectTo: `${location.origin}/auth/callback` },
    });
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-duo-gray-500 dark:text-slate-100">
          欢迎回来
        </h1>
        <p className="mb-8 text-center text-duo-gray-300 dark:text-slate-400">
          登录以同步学习进度
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="邮箱地址"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-duo-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-duo-gray-500 dark:text-slate-100 placeholder:text-duo-gray-300 dark:placeholder:text-slate-500 outline-none focus:border-duo-blue transition-colors"
          />
          <input
            type="password"
            placeholder="密码"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full rounded-2xl border-2 border-duo-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 text-duo-gray-500 dark:text-slate-100 placeholder:text-duo-gray-300 dark:placeholder:text-slate-500 outline-none focus:border-duo-blue transition-colors"
          />

          {error && (
            <p className="text-sm text-duo-red">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="btn-primary disabled:opacity-50"
          >
            {loading ? "登录中..." : "登录"}
          </button>
        </form>

        <div className="my-6 flex items-center gap-3">
          <div className="h-px flex-1 bg-duo-gray-200 dark:bg-slate-700" />
          <span className="text-sm text-duo-gray-300 dark:text-slate-500">或</span>
          <div className="h-px flex-1 bg-duo-gray-200 dark:bg-slate-700" />
        </div>

        <button
          onClick={handleGitHub}
          className="w-full rounded-2xl border-2 border-duo-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 px-4 py-3 font-medium text-duo-gray-500 dark:text-slate-100 transition-all active:scale-[0.98]"
        >
          <span className="flex items-center justify-center gap-2">
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            使用 GitHub 登录
          </span>
        </button>

        <p className="mt-6 text-center text-sm text-duo-gray-300 dark:text-slate-400">
          还没有账号？{" "}
          <Link href="/auth/signup" className="font-bold text-duo-blue">
            注册
          </Link>
        </p>
      </div>
    </div>
  );
}
