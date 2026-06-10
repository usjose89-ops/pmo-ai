"use client";
import React, { useState, useEffect } from 'react';
import {
    AlertTriangle,
    Bot,
    CheckCircle,
    AlertCircle,
    TrendingUp,
    BrainCircuit,
    Save,
    RotateCcw
} from 'lucide-react';
import { RiskAssessmentService, RiskModuleAssessment, ProjectRiskProfile } from '@/services/RiskAssessmentService';

interface ProjectRiskAssessmentProps {
    projectId: number;
    onClose: () => void;
}

export const ProjectRiskAssessment: React.FC<ProjectRiskAssessmentProps> = ({ projectId, onClose }) => {
    const [loading, setLoading] = useState(false);
    const [projectProfile, setProjectProfile] = useState<ProjectRiskProfile | null>(null);
    const [aiAnalyzing, setAiAnalyzing] = useState(false);

    useEffect(() => {
        // Load initial profile (mock)
        const profile = RiskAssessmentService.getProjectRisk(projectId);
        if (profile) setProjectProfile(profile);
    }, [projectId]);

    const handleAnalyzeWithAI = async () => {
        setAiAnalyzing(true);
        try {
            const aiSuggestions = await RiskAssessmentService.analyzeProjectWithAI(projectId);

            if (projectProfile && aiSuggestions.length > 0) {
                // Apply AI suggestions
                const updatedModules = projectProfile.modules.map(mod => {
                    const suggestion = aiSuggestions.find(s => s.moduleId === mod.moduleId);
                    if (suggestion) {
                        return { ...mod, aiScore: suggestion.aiScore, actionPlan: suggestion.actionPlan, comments: suggestion.comments };
                    }
                    return mod;
                });
                setProjectProfile({ ...projectProfile, modules: updatedModules });
            }
        } catch (error) {
            console.error("AI Analysis failed", error);
        } finally {
            setAiAnalyzing(false);
        }
    };

    const getScoreColor = (val: number) => {
        if (val <= 2) return 'bg-emerald-100 text-emerald-700';
        if (val <= 3) return 'bg-amber-100 text-amber-700';
        return 'bg-rose-100 text-rose-700';
    };

    if (!projectProfile) return <div className="p-10 text-center">Cargando perfil de riesgos...</div>;

    return (
        <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-300">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden">

                {/* HEADER */}
                <div className="p-8 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                    <div>
                        <div className="flex items-center gap-3 mb-2">
                            <div className="bg-indigo-600 p-2 rounded-lg text-white">
                                <AlertTriangle size={24} />
                            </div>
                            <h2 className="text-2xl font-black text-slate-900">Evaluación de Riesgos Modular</h2>
                        </div>
                        <p className="text-slate-500 text-sm">Análisis detallado por área funcional asistido por IA</p>
                    </div>

                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] uppercase font-black text-slate-400">Riesgo Global</p>
                            <p className={`text-3xl font-black ${projectProfile.globalScore >= 4 ? 'text-rose-600' : 'text-emerald-600'}`}>
                                {projectProfile.globalScore}
                            </p>
                        </div>
                        <button onClick={onClose} className="bg-white hover:bg-slate-100 text-slate-600 px-6 py-3 rounded-xl font-bold border border-slate-200 transition-all">
                            Cerrar
                        </button>
                    </div>
                </div>

                {/* AI ACTION BAR */}
                <div className="p-6 bg-indigo-50 border-b border-indigo-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white shadow-lg shadow-indigo-300 animate-pulse">
                            <BrainCircuit size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-indigo-900">PMO AI Risk Engine</h3>
                            <p className="text-xs text-indigo-600 font-medium">Escaneando subsistemas (HR, Compras, Finanzas)...</p>
                        </div>
                    </div>
                    <button
                        onClick={handleAnalyzeWithAI}
                        disabled={aiAnalyzing}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-bold flex items-center shadow-lg shadow-indigo-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {aiAnalyzing ? (
                            <>
                                <RotateCcw className="mr-2 animate-spin" size={18} /> Analizando...
                            </>
                        ) : (
                            <>
                                <Bot className="mr-2" size={18} /> Analizar con IA
                            </>
                        )}
                    </button>
                </div>

                {/* TABLE CONTENT */}
                <div className="flex-1 overflow-auto p-8">
                    <table className="w-full">
                        <thead>
                            <tr className="text-left text-[10px] uppercase font-black text-slate-400 border-b border-slate-100">
                                <th className="pb-4 pl-4">Módulo</th>
                                <th className="pb-4">Peso</th>
                                <th className="pb-4 text-center">Score Manual</th>
                                <th className="pb-4 text-center">IA Score</th>
                                <th className="pb-4 w-1/3">Observaciones & Plan de Acción</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            {projectProfile.modules.map((mod) => (
                                <tr key={mod.moduleId} className="group hover:bg-slate-50/50 transition-colors">
                                    <td className="py-6 pl-4 font-bold text-slate-700">{mod.moduleId}</td>
                                    <td className="py-6 text-slate-500 text-xs">{(mod.weight * 100).toFixed(0)}%</td>

                                    {/* Manual Score */}
                                    <td className="py-6 text-center">
                                        <div className={`px-3 py-1 rounded-lg inline-block text-sm font-black ${getScoreColor(mod.score)}`}>
                                            {mod.score}
                                        </div>
                                    </td>

                                    {/* AI Score Suggestion */}
                                    <td className="py-6 text-center">
                                        {mod.aiScore ? (
                                            <div className="flex flex-col items-center animate-in zoom-in duration-300">
                                                <div className={`px-3 py-1 rounded-lg inline-block text-sm font-black border-2 border-dashed ${mod.aiScore > mod.score ? 'border-rose-400 text-rose-600 bg-rose-50' : 'border-indigo-400 text-indigo-600 bg-indigo-50'}`}>
                                                    {mod.aiScore}
                                                </div>
                                                <span className="text-[10px] font-bold text-indigo-400 mt-1">Sugerido</span>
                                            </div>
                                        ) : (
                                            <span className="text-slate-300">-</span>
                                        )}
                                    </td>

                                    {/* Comments & Action Plan */}
                                    <td className="py-6 pr-4">
                                        <div className="text-xs text-slate-600 mb-2 p-3 bg-white border border-slate-100 rounded-xl shadow-sm">
                                            {mod.comments}
                                        </div>
                                        {mod.actionPlan && (
                                            <div className="text-xs p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-800 animate-in slide-in-from-right duration-500">
                                                <div className="flex items-center gap-2 mb-1 font-bold text-indigo-700 uppercase text-[10px]">
                                                    <Bot size={12} /> Plan de Mitigación
                                                </div>
                                                {mod.actionPlan}
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* FOOTER */}
                <div className="p-6 border-t border-slate-100 bg-white flex justify-end">
                    <button className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-xl font-bold flex items-center shadow-xl transition-all">
                        <Save className="mr-2" size={18} /> Guardar Evaluación
                    </button>
                </div>
            </div>
        </div>
    );
};
