"use client";
import React from 'react';
import { MOCK_PROJECTS } from '@/data/mockData';
import { ProjectsList } from '@/components/dashboard/ProjectsList';

export default function ProjectsPage() {
    return (
        <div className="p-10 space-y-8 animate-in fade-in duration-500 bg-[#f8fafc] min-h-full">


            {/* 
                TODO: Enhance ProjectsList to become the "Base Table" with PV, EV, AC columns 
                as requested in the "Excel" reference. For now we reuse the existing list
                but wrapped in this new page route.
            */}
            <ProjectsList projects={MOCK_PROJECTS} onNewProject={() => { }} />
        </div>
    );
}
