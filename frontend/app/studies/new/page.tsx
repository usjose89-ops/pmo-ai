
"use client";

import React from 'react';
import { ProposalGenerator } from '@/components/proposal/ProposalGenerator';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewStudyPage() {
    return (
        <div className="min-h-screen bg-[#f8fafc] p-10">
            <div className="max-w-7xl mx-auto space-y-6">

                {/* Back Button */}
                <Link href="/projects" className="inline-flex items-center text-slate-500 hover:text-slate-800 transition-colors font-medium">
                    <ArrowLeft className="mr-2" size={20} />
                    Volver al Portafolio
                </Link>

                <div className="flex flex-col gap-2">
                    <h1 className="text-3xl font-black text-slate-900">Nuevo Estudio de Propuesta</h1>
                    <p className="text-slate-500">
                        Sube las bases del proyecto y deja que la IA estructure el APU, la dotación y los costos indirectos.
                    </p>
                </div>

                <div className="mt-8">
                    <ProposalGenerator />
                </div>
            </div>
        </div>
    );
}
