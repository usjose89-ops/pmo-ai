"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { HardHat } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      console.error(signInError);
      if (signInError.message.includes('Email not confirmed')) {
        setError('Debes confirmar tu correo electrónico. Por favor revisa tu bandeja de entrada o la carpeta de Spam para activar tu cuenta.');
      } else {
        setError(`Error: ${signInError.message}`);
      }
      setLoading(false);
      return;
    }

    router.push('/');
    router.refresh();
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-lg mb-6">
            <HardHat className="h-8 w-8 text-indigo-500" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Acceso Restringido
          </h2>
          <p className="mt-2 text-sm text-slate-500 font-medium uppercase tracking-widest">
            PMO AI
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor="email">
                Correo Electrónico
              </label>
              <input
                id="email"
                type="email"
                required
                className="mt-1 appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="usuario@empresa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-bold text-slate-700" htmlFor="password">
                Contraseña
              </label>
              <input
                id="password"
                type="password"
                required
                className="mt-1 appearance-none block w-full px-4 py-3 border border-slate-300 rounded-xl placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl text-sm font-medium border border-red-100">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-slate-900 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Verificando credenciales...' : 'Iniciar Sesión'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
