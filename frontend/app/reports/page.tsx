"use client";

import React from "react";
import { ReportGenerator } from "@/components/reports/ReportGenerator";

export default function ReportsPage() {
    return (
        <div className="min-h-screen bg-slate-100 p-8">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-slate-800 mb-8">
                    Previsualización de Reportes
                </h1>
                <ReportGenerator />
            </div>
        </div>
    );
}
