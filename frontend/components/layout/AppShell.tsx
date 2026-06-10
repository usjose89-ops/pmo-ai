
"use client";

import React, { useState, useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { Project, ProjectStatus } from '@/types/project';
import { projectService } from '@/services/projectService';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import {
  Home,
  FileText,
  HardHat,
  Users,
  Bot,
  Settings,
  Menu,
  Bell,
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  Activity,
  FolderOpen
} from 'lucide-react';

interface AppShellProps {
  children: React.ReactNode;
}

const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<string[]>(['portfolio']); // Default portfolio open
  const [isMounted, setIsMounted] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    setIsMounted(true);
    const fetchProjects = async () => {
      try {
        const data = await projectService.getProjects();
        setProjects(data);
      } catch (err) {
        console.error('Error fetching sidebar projects:', err);
      }
    };
    
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setUserEmail(user.email ?? null);
      }
    };

    fetchProjects();
    fetchUser();
  }, [supabase]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  };

  // Determine current project based on URL
  const projectId = pathname?.split('/')[2]; // /projects/1/... -> 1
  const currentProject = projectId
    ? projects.find(p => String(p.id) === projectId)?.name
    : null;

  const toggleGroup = (group: string) => {
    if (expandedGroups.includes(group)) {
      setExpandedGroups(expandedGroups.filter(g => g !== group));
    } else {
      setExpandedGroups([...expandedGroups, group]);
    }
  };

  // Filter Projects by Status
  const studyProjects = projects.filter(p => p.status === ProjectStatus.EN_ANALISIS);
  const activeProjects = projects.filter(p => p.status === ProjectStatus.ADJUDICADO_EN_CURSO);
  const closedProjects = projects.filter(p => p.status === ProjectStatus.TERMINADO);

  // Prevent hydration errors by rendering nothing until mounted
  if (!isMounted) {
    return null;
  }

  const isAuthPage = pathname?.startsWith('/login') || pathname?.startsWith('/unauthorized');

  if (isAuthPage) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        {children}
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 text-slate-900">
      {/* Sidebar */}
      <aside
        className={`${isSidebarOpen ? 'w-72' : 'w-20'
          } bg-slate-900 text-white transition-all duration-300 flex flex-col fixed h-full z-20 md:relative shadow-2xl`}
      >
        <div className="p-5 flex items-center justify-between border-b border-slate-700/50 bg-slate-900">
          {isSidebarOpen ? (
            <span className="text-xl font-extrabold tracking-wider text-white">
              PMO <span className="text-indigo-500">AI</span>
            </span>
          ) : (
            <span className="text-xl font-bold text-indigo-500">PAI</span>
          )}
          <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1.5 hover:bg-slate-800 rounded-lg text-slate-400 hover:text-white transition-colors">
            <Menu size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-6 px-3 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">

          {/* NIVEL 1: ESTRATEGIA */}
          <div>
            {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Estrategia</p>}
            <Link href="/" className={`flex items-center px-3 py-2.5 rounded-lg transition-all group ${pathname === '/' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30' : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'}`}>
              <LayoutDashboard className={`h-5 w-5 ${pathname === '/' ? 'text-white' : 'text-slate-500 group-hover:text-indigo-400'}`} />
              {isSidebarOpen && <span className="ml-3 text-sm font-bold">Dashboard Ejecutivo</span>}
            </Link>
          </div>

          {/* NIVEL 2: TÁCTICA (PORTAFOLIO) */}
          <div>
            {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-4">Táctica</p>}

            {/* Portfolio Group Toggle */}
            <button
              onClick={() => toggleGroup('portfolio')}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg transition-all group ${pathname?.startsWith('/projects') ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-500/30' : 'hover:bg-slate-800/50 text-slate-300 hover:text-white'}`}
            >
              <div className="flex items-center">
                <HardHat className={`h-5 w-5 ${pathname?.startsWith('/projects') ? 'text-indigo-400' : 'text-slate-500 group-hover:text-amber-400'}`} />
                {isSidebarOpen && <span className="ml-3 text-sm font-bold">Portafolio</span>}
              </div>
              {isSidebarOpen && (
                <ChevronRight size={16} className={`transition-transform duration-200 ${expandedGroups.includes('portfolio') ? 'rotate-90' : ''}`} />
              )}
            </button>

            {/* Portfolio Sub-groups */}
            {isSidebarOpen && expandedGroups.includes('portfolio') && (
              <div className="mt-1 ml-2 pl-2 border-l border-slate-700 space-y-1 animate-in slide-in-from-left-2 duration-200">

                {/* 1. EN ESTUDIO */}
                <div className="py-1">
                  <div className="px-3 py-1 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <FolderOpen size={10} className="mr-1.5" /> En Estudio
                  </div>
                  {studyProjects.map(p => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-800/30 text-slate-400 hover:text-white transition-all text-xs ml-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                      {p.name}
                    </Link>
                  ))}
                  {studyProjects.length === 0 && <span className="px-5 text-[10px] text-slate-600 italic">Sin proyectos</span>}
                </div>

                {/* 2. ACTIVOS */}
                <div className="py-1">
                  <div className="px-3 py-1 flex items-center text-[10px] font-bold text-emerald-600/70 uppercase tracking-wider">
                    <div className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></div> Activos
                  </div>
                  {activeProjects.map(p => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-800/30 text-slate-300 hover:text-white transition-all text-xs ml-2 font-medium">
                      {p.name}
                    </Link>
                  ))}
                  {activeProjects.length === 0 && <span className="px-5 text-[10px] text-slate-600 italic">Sin proyectos activos</span>}
                </div>

                {/* 3. CERRADOS */}
                <div className="py-1">
                  <div className="px-3 py-1 flex items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                    <CheckCircleIcon size={10} className="mr-1.5" /> Cerrados
                  </div>
                  {closedProjects.map(p => (
                    <Link key={p.id} href={`/projects/${p.id}`} className="flex items-center px-3 py-1.5 rounded-lg hover:bg-slate-800/30 text-slate-500 hover:text-white transition-all text-xs ml-2 decoration-slate-600">
                      {p.name}
                    </Link>
                  ))}
                </div>

              </div>
            )}
          </div>

          {/* NIVEL 3: OPERACIÓN */}
          <div>
            {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-4">Operación</p>}

            <Link href="/operations" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all group">
              <Activity className="h-5 w-5 text-slate-500 group-hover:text-rose-400" />
              {isSidebarOpen && <span className="ml-3 text-sm font-medium">Control Operacional</span>}
            </Link>
            <Link href="/clients" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all group">
              <Users className="h-5 w-5 text-slate-500 group-hover:text-blue-400" />
              {isSidebarOpen && <span className="ml-3 text-sm font-medium">Clientes & Stakeholders</span>}
            </Link>
            <Link href="/parameters" className="flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800/50 text-slate-300 hover:text-white transition-all group">
              <Settings className="h-5 w-5 text-slate-500 group-hover:text-gray-400" />
              {isSidebarOpen && <span className="ml-3 text-sm font-medium">Parámetros de Costos</span>}
            </Link>
          </div>

          {/* NIVEL 4: ADMINISTRACIÓN */}
          <div>
            {isSidebarOpen && <p className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 mt-4">Administración</p>}

            <Link href="/setup/projects" className={`flex items-center px-3 py-2.5 rounded-lg hover:bg-slate-800/50 transition-all group ${pathname?.startsWith('/setup/projects') ? 'bg-indigo-900/50 text-indigo-200 border border-indigo-500/30' : 'text-slate-300 hover:text-white'}`}>
              <Settings className={`h-5 w-5 ${pathname?.startsWith('/setup/projects') ? 'text-indigo-400' : 'text-slate-500 group-hover:text-emerald-400'}`} />
              {isSidebarOpen && <span className="ml-3 text-sm font-medium">Setup de Proyectos</span>}
            </Link>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800 bg-slate-900/50">
          <div className="flex items-center">
            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-slate-700 shadow-lg shrink-0">
              {userEmail ? userEmail.charAt(0).toUpperCase() : 'U'}
            </div>
            {isSidebarOpen && (
              <div className="ml-3 truncate">
                <p className="text-sm font-bold text-white truncate" title={userEmail || ''}>
                  {userEmail || 'Usuario'}
                </p>
                <p className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">PMO MANAGER</p>
              </div>
            )}
          </div>
          {isSidebarOpen && (
            <button 
              onClick={handleSignOut}
              className="mt-4 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-lg transition-colors flex items-center justify-center"
            >
              Cerrar Sesión
            </button>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden bg-white">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-100 px-8 py-4 flex items-center justify-between relative z-10">
          {/* Breadcrumbs / Context */}
          <div className="flex items-center space-x-4">
            {currentProject && (
              <div className="hidden md:flex flex-col animate-in fade-in duration-300">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Proyecto Actual</span>
                <div className="flex items-center cursor-pointer hover:text-indigo-600 transition-colors group">
                  <span className="font-extrabold text-2xl text-slate-900 group-hover:text-indigo-600">{currentProject}</span>
                  <ChevronDown size={16} className="ml-2 mt-1 text-slate-300 group-hover:text-indigo-400" />
                </div>
              </div>
            )}
            {!currentProject && (
              <div className="flex items-center text-slate-400">
                <Home size={16} className="mr-2" />
                <span className="text-sm font-medium">/ Portfolio Overview</span>
              </div>
            )}
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-6">
            <button className="relative p-2 text-slate-400 hover:text-indigo-600 transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white"></span>
            </button>
            <div className="h-8 w-px bg-slate-100 mx-2"></div>
            <div className="text-right">
              <div className="text-sm font-bold text-slate-900">PMO - Infraestructuras Eléctricas Mineras</div>
              <div className="text-[10px] text-slate-400 font-medium">Enterprise Plan</div>
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-auto bg-slate-50/50">
          {children}
        </main>
      </div>
    </div>
  );
};

// Start Icon Helper (Internal to avoid import issues if missing)
const CheckCircleIcon = ({ size, className }: { size: number, className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
);

export default AppShell;
