import { Suspense } from "react";
import LoginForm from "./LoginForm";

const C = {
  pageBg: "#09090b",
  t1: "#f4f4f5",
} as const;

function LoginFallback() {
  return (
    <main
      className="flex min-h-screen items-center justify-center px-4 py-10"
      style={{ background: C.pageBg, color: C.t1 }}
    >
      <div className="text-sm text-zinc-500">Loading secure access…</div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <LoginForm />
    </Suspense>
  );
}