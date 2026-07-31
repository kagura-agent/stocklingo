"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: `${location.origin}/auth/callback` },
    });

    if (error) {
      setError(error.message);
    } else {
      setSuccess(true);
    }
    setLoading(false);
  }

  if (success) {
    return (
      <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
        <div className="card w-full max-w-sm text-center">
          <p className="text-4xl mb-4">📧</p>
          <h2 className="text-xl font-bold text-duo-gray-500 dark:text-slate-100 mb-2">
            验证邮件已发送
          </h2>
          <p className="text-duo-gray-300 dark:text-slate-400">
            请查看你的邮箱并点击验证链接完成注册
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="mb-2 text-center text-2xl font-bold text-duo-gray-500 dark:text-slate-100">
          创建账号
        </h1>
        <p className="mb-8 text-center text-duo-gray-300 dark:text-slate-400">
          注册以保存学习进度
        </p>

        <form onSubmit={handleSignup} className="space-y-4">
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
            placeholder="密码（至少6位）"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
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
            {loading ? "注册中..." : "注册"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-duo-gray-300 dark:text-slate-400">
          已有账号？{" "}
          <Link href="/auth/login" className="font-bold text-duo-blue">
            登录
          </Link>
        </p>
      </div>
    </div>
  );
}
