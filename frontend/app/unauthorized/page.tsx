"use client";

import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ShieldAlert } from 'lucide-react';

export default function UnauthorizedPage() {
  const router = useRouter();
  const supabase = createClient();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  return (
    <div className="flex-1 flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-2xl shadow-xl border border-red-100 text-center">
        <div className="mx-auto h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mb-6">
          <ShieldAlert className="h-10 w-10 text-red-600" />
        </div>
        
        <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Acceso No Autorizado
        </h2>
        
        <div className="mt-4 text-sm text-slate-600 space-y-4">
          <p>
            Has iniciado sesión correctamente, pero tu cuenta no tiene los privilegios necesarios para acceder al Dashboard de PMO AI.
          </p>
          <p className="font-medium text-slate-900">
            El acceso está estrictamente reservado para administradores autorizados.
          </p>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSignOut}
            className="w-full flex justify-center py-3.5 px-4 border border-slate-300 text-sm font-bold rounded-xl text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all shadow-sm"
          >
            Cerrar Sesión y Volver
          </button>
        </div>
      </div>
    </div>
  );
}
