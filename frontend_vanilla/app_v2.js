document.addEventListener('DOMContentLoaded', async () => {
    lucide.createIcons();
    const supabase = window.supabaseClient;

    // DOM Elements
    const projectsListContainer = document.getElementById('sidebar-projects-list');
    
    // KPI Elements
    const valRevenue = document.getElementById('val-revenue');
    const valTargetRevenue = document.getElementById('val-target-revenue');
    const badgeRevenue = document.getElementById('badge-revenue');
    const valMargin = document.getElementById('val-margin');
    const valTargetMargin = document.getElementById('val-target-margin');
    const badgeMargin = document.getElementById('badge-margin');
    const valSpi = document.getElementById('val-spi');
    const valCpi = document.getElementById('val-cpi');
    const hrHeadcount = document.getElementById('hr-headcount');
    const hrHh = document.getElementById('hr-hh');
    const hrCostHh = document.getElementById('hr-costhh');
    const hrFactor = document.getElementById('hr-factor');

    // Modal Elements
    const modal = document.getElementById('project-modal');
    const btnNewProject = document.getElementById('btn-new-project');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const projectForm = document.getElementById('project-form');
    
    const formId = document.getElementById('form-id');
    const formName = document.getElementById('form-name');
    const formCode = document.getElementById('form-code');
    const formClient = document.getElementById('form-client');
    const formStatus = document.getElementById('form-status');
    const formTargetRevenue = document.getElementById('form-target-revenue');
    const formHeadcount = document.getElementById('form-headcount');

    // Filters & State
    let portfolioFilter = 'TODOS';
    let allProjects = [];

    const formatMM = (val) => Math.round(val / 1000000).toLocaleString('de-DE');

    function updateDashboard() {
        const filtered = allProjects.filter(p => {
            if (portfolioFilter === 'TODOS') return true;
            if (portfolioFilter === 'ACTIVO') return p.status === 'ACTIVO' || p.status === 'TERMINADO';
            if (portfolioFilter === 'EN_ESTUDIO') return p.status === 'EN_ESTUDIO';
            return true;
        });

        let totalRevenue = 0, totalMargin = 0, targetRevenue = 0, sumTargetMarginPercent = 0;
        let sumSpi = 0, sumCpi = 0, sumHeadcount = 0, sumHh = 0, sumCostHh = 0, sumFactor = 0;

        filtered.forEach(p => {
            const fin = p.financials || {};
            const hr = p.hr_metrics || {};

            totalRevenue += fin.total_revenue || 0;
            totalMargin += fin.gross_margin || 0;
            targetRevenue += fin.target_revenue || 0;
            sumTargetMarginPercent += fin.target_margin_percent || 0;
            sumSpi += fin.spi || 1;
            sumCpi += fin.cpi || 1;

            sumHeadcount += hr.headcount || 0;
            sumHh += hr.total_hh || 0;
            sumCostHh += hr.avg_cost_hh || 0;
            sumFactor += hr.productive_factor || 0;
        });

        const count = filtered.length || 1;

        const globalMarginPercent = totalRevenue > 0 ? (totalMargin / totalRevenue) * 100 : 0;
        const avgTargetMargin = sumTargetMarginPercent / count;
        const marginDeviation = globalMarginPercent - avgTargetMargin;
        const revenueDeviation = targetRevenue > 0 ? ((totalRevenue - targetRevenue) / targetRevenue) * 100 : 0;
        const avgSpi = sumSpi / count;
        const avgCpi = sumCpi / count;
        const avgCostHh = sumCostHh / count;
        const avgFactor = sumFactor / count;

        valRevenue.textContent = formatMM(totalRevenue);
        valTargetRevenue.textContent = formatMM(targetRevenue);
        badgeRevenue.textContent = `${revenueDeviation >= 0 ? '+' : ''}${revenueDeviation.toFixed(1)}%`;
        badgeRevenue.className = `badge ${revenueDeviation >= 0 ? 'badge-green' : 'badge-red'}`;

        valMargin.textContent = `${globalMarginPercent.toFixed(1)}%`;
        valTargetMargin.textContent = avgTargetMargin.toFixed(1);
        badgeMargin.textContent = `${marginDeviation >= 0 ? '+' : ''}${marginDeviation.toFixed(1)}%`;
        badgeMargin.className = `badge ${marginDeviation >= 0 ? 'badge-green' : 'badge-red'}`;

        valSpi.textContent = avgSpi.toFixed(2);
        valSpi.className = `sc-val ${avgSpi >= 1 ? 'text-green' : 'text-red'}`;
        valCpi.textContent = avgCpi.toFixed(2);
        valCpi.className = `sc-val ${avgCpi >= 1 ? 'text-green' : 'text-red'}`;

        hrHeadcount.textContent = sumHeadcount.toLocaleString('de-DE');
        hrHh.textContent = (sumHh / 1000).toFixed(1);
        hrCostHh.textContent = avgCostHh.toFixed(2);
        hrFactor.textContent = avgFactor.toFixed(2);
        hrFactor.className = `hr-val ${avgFactor >= 0.8 ? 'text-green' : 'text-red'}`;
    }

    async function fetchProjects() {
        try {
            const { data: projects, error } = await supabase.from('projects').select('*').order('name');
            if (error) throw error;

            allProjects = projects || [];
            
            if (allProjects.length > 0) {
                projectsListContainer.innerHTML = allProjects.map(p => {
                    const statusClass = p.status === 'EN_ESTUDIO' ? 'en-estudio' : 'activos';
                    return `
                        <li class="subnav-item-container">
                            <span class="subnav-item ${statusClass}">${p.name}</span>
                            <div class="actions">
                                <button class="btn-action-icon edit-project" data-id="${p.id}" title="Editar">
                                    <i data-lucide="edit-2" style="width: 14px; height: 14px;"></i>
                                </button>
                                <button class="btn-action-icon delete delete-project" data-id="${p.id}" title="Eliminar">
                                    <i data-lucide="trash-2" style="width: 14px; height: 14px;"></i>
                                </button>
                            </div>
                        </li>
                    `;
                }).join('');
                lucide.createIcons();
                attachCrudListeners();
            } else {
                projectsListContainer.innerHTML = '<li class="subnav-title">No hay proyectos</li>';
            }
            updateDashboard();

        } catch (err) {
            console.error('Error fetching projects:', err);
            projectsListContainer.innerHTML = '<li class="subnav-title text-red">Error DB</li>';
        }
    }

    // --- CRUD Modal Logic ---
    function openModal(project = null) {
        if (project) {
            document.getElementById('modal-title').textContent = 'Editar Proyecto';
            formId.value = project.id;
            formName.value = project.name;
            formCode.value = project.code;
            formClient.value = project.client || '';
            formStatus.value = project.status;
            // Parse financials/hr
            formTargetRevenue.value = (project.financials?.target_revenue || 0) / 1000000;
            formHeadcount.value = project.hr_metrics?.headcount || 0;
        } else {
            document.getElementById('modal-title').textContent = 'Nuevo Proyecto';
            projectForm.reset();
            formId.value = '';
        }
        modal.classList.remove('hidden');
    }

    function closeModal() {
        modal.classList.add('hidden');
    }

    btnNewProject.addEventListener('click', () => openModal());
    btnCloseModal.addEventListener('click', closeModal);
    btnCancelModal.addEventListener('click', closeModal);

    // Save Project (Insert or Update)
    projectForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const projectData = {
            name: formName.value,
            code: formCode.value,
            client: formClient.value,
            status: formStatus.value,
            financials: {
                target_revenue: parseFloat(formTargetRevenue.value) * 1000000,
                total_revenue: parseFloat(formTargetRevenue.value) * 1000000, // MVP simple math
                target_margin_percent: 15,
                spi: 1.0,
                cpi: 1.0
            },
            hr_metrics: {
                headcount: parseInt(formHeadcount.value),
                total_hh: parseInt(formHeadcount.value) * 180, // rough estimate MVP
                avg_cost_hh: 15000,
                productive_factor: 0.85
            }
        };

        try {
            if (formId.value) {
                // Update
                await supabase.from('projects').update(projectData).eq('id', formId.value);
            } else {
                // Insert
                await supabase.from('projects').insert([projectData]);
            }
            closeModal();
            fetchProjects();
        } catch (err) {
            alert('Error guardando proyecto: ' + err.message);
        }
    });

    // Attach Edit/Delete Listeners
    function attachCrudListeners() {
        document.querySelectorAll('.edit-project').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                const project = allProjects.find(p => p.id === id);
                if (project) openModal(project);
            });
        });

        document.querySelectorAll('.delete-project').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.currentTarget.getAttribute('data-id');
                if (confirm('¿Estás seguro de eliminar este proyecto permanentemente?')) {
                    try {
                        await supabase.from('projects').delete().eq('id', id);
                        fetchProjects();
                    } catch (err) {
                        alert('Error eliminando: ' + err.message);
                    }
                }
            });
        });
    }

    // Tabs
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            portfolioFilter = e.target.getAttribute('data-filter');
            updateDashboard();
        });
    });

    fetchProjects();
});
