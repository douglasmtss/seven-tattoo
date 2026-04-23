"use client";

import { useState, FormEvent, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams, useRouter } from "next/navigation";
import Button from "@/components/ui/Button";
import { Lock } from "lucide-react";

function LoginForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const searchParams = useSearchParams();
  const router = useRouter();
  const callbackUrl = searchParams.get("callbackUrl") || "/admin";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const result = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Usuário ou senha inválidos.");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Erro ao fazer login. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0d0d0d] flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <span className="text-[var(--gold)] text-4xl font-bold tracking-widest uppercase block">
            Seven
          </span>
          <span className="text-[var(--foreground)] text-sm tracking-[0.4em] uppercase">
            Tattoo
          </span>
          <div className="mt-4 flex items-center justify-center gap-2 text-[var(--text-muted)] text-sm">
            <Lock size={14} />
            <span>Área Administrativa</span>
          </div>
        </div>

        <form
          onSubmit={(e) => void handleSubmit(e)}
          className="bg-[var(--surface)] border border-[var(--border)] p-8 rounded"
        >
          {error && (
            <div className="mb-4 p-3 bg-red-900/30 border border-red-700 text-red-400 text-sm rounded">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label
                htmlFor="username"
                className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2"
              >
                Usuário
              </label>
              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
                autoComplete="username"
                required
                maxLength={100}
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-xs tracking-widest uppercase text-[var(--text-muted)] mb-2"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--foreground)] px-4 py-3 text-sm focus:outline-none focus:border-[var(--gold)] transition-colors"
                autoComplete="current-password"
                required
                maxLength={200}
              />
            </div>
          </div>

          <Button
            type="submit"
            isLoading={isLoading}
            className="w-full mt-6 tracking-widest"
          >
            Entrar
          </Button>
        </form>

        <p className="text-center mt-4 text-[var(--text-muted)] text-xs">
          <a href="/" className="hover:text-[var(--gold)] transition-colors">
            ← Voltar ao site
          </a>
        </p>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#0d0d0d]" />}>
      <LoginForm />
    </Suspense>
  );
}
