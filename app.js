class TaskManager {
    constructor() {
        this.tasks = {
            daily: [],
            weekly: [],
            monthly: []
        };
        this.projects = [];
        this.archivedProjects = [];
        this.fileHandle = null; // Para File System Access API
        this.autoSaveEnabled = localStorage.getItem('autoSaveEnabled') === 'true';
        this.userId = this.getUserId(); // ID único para este usuario
        this.unsubscribeFirestore = null; // Listener de cambios en tiempo real
        this.init();
    }

    getUserId() {
        // Obtener o crear un ID único para este usuario
        let userId = localStorage.getItem('userId');
        if (!userId) {
            userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
            localStorage.setItem('userId', userId);
        }
        return userId;
    }

    init() {
        this.setupEventListeners();
        
        // Cargar datos (primero local, luego Firebase si está disponible)
        this.loadFromStorage().then(() => {
            this.renderAll();
            this.checkAutomaticResets();
            
            // Actualizar indicador de estado
            this.updateCloudStatus();
            
            // Si Firebase está habilitado, configurar sincronización en tiempo real
            if (firebaseEnabled) {
                this.setupFirebaseSync();
            }
        });
    }
    
    updateCloudStatus() {
        const statusEl = document.getElementById('cloudStatus');
        if (!statusEl) return;
        
        if (firebaseEnabled) {
            statusEl.textContent = '☁️ Sincronizado';
            statusEl.classList.add('connected');
            statusEl.title = 'Conectado a la nube - Tus datos se sincronizan automáticamente';
        } else {
            statusEl.textContent = '☁️ Local';
            statusEl.classList.remove('connected', 'syncing');
            statusEl.title = 'Solo guardado local - Configura Firebase para sincronizar entre dispositivos';
        }
    }

    setupEventListeners() {
        // Pestañas
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.switchTab(e.target.dataset.tab));
        });

        // Archivo de tareas
        document.getElementById('dailyFile').addEventListener('change', (e) => this.handleFileUpload(e, 'daily'));
        document.getElementById('weeklyFile').addEventListener('change', (e) => this.handleFileUpload(e, 'weekly'));
        document.getElementById('monthlyFile').addEventListener('change', (e) => this.handleFileUpload(e, 'monthly'));
        document.getElementById('projectFile').addEventListener('change', (e) => this.handleProjectFileSelect(e));

        // Exportar/Importar
        document.getElementById('exportBtn').addEventListener('click', () => this.exportData());
        document.getElementById('importBtn').addEventListener('click', () => this.importData());
        
        // Auto-guardado en archivo
        const autoSaveBtn = document.getElementById('autoSaveBtn');
        if (autoSaveBtn) {
            this.updateAutoSaveButton();
            autoSaveBtn.addEventListener('click', () => this.toggleAutoSave());
        }
    }

    switchTab(tabName) {
        document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(content => content.classList.remove('active'));
        
        document.querySelector(`[data-tab="${tabName}"]`).classList.add('active');
        document.getElementById(tabName).classList.add('active');
    }

    handleFileUpload(event, taskType) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const content = e.target.result;
            this.parseTasks(content, taskType);
        };
        reader.readAsText(file);
    }

    parseTasks(content, taskType) {
        const lines = content.split('\n');
        const tasks = [];
        let currentTask = null;

        lines.forEach(line => {
            if (!line.trim()) return;

            // Contar tabuladores al inicio
            const tabCount = (line.match(/^\t*/)[0] || '').length;
            const text = line.trim();

            if (tabCount === 0) {
                // Tarea principal
                currentTask = {
                    id: Date.now() + Math.random(),
                    text: text,
                    completed: false,
                    subtasks: []
                };
                tasks.push(currentTask);
            } else if (currentTask) {
                // Subtarea
                currentTask.subtasks.push({
                    id: Date.now() + Math.random(),
                    text: text,
                    completed: false
                });
            }
        });

        this.tasks[taskType] = tasks;
        this.saveToStorage();
        this.renderTasks(taskType);
    }

    renderTasks(taskType) {
        const container = document.getElementById(`${taskType}Tasks`);
        const tasks = this.tasks[taskType];

        if (!tasks || tasks.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📋</div>
                    <div class="empty-state-text">No hay tareas cargadas. Carga un archivo de texto para comenzar.</div>
                </div>
            `;
            this.updateProgress(taskType);
            return;
        }

        container.innerHTML = tasks.map(task => `
            <div class="task-item ${task.completed ? 'completed' : ''}">
                <div class="task-header">
                    <input type="checkbox" 
                           class="task-checkbox" 
                           ${task.completed ? 'checked' : ''}
                           onchange="taskManager.toggleTask('${taskType}', ${task.id})">
                    <span class="task-text">${this.escapeHtml(task.text)}</span>
                </div>
                ${task.subtasks.length > 0 ? `
                    <div class="subtasks">
                        ${task.subtasks.map(subtask => `
                            <div class="subtask-item ${subtask.completed ? 'completed' : ''}">
                                <input type="checkbox" 
                                       class="subtask-checkbox" 
                                       ${subtask.completed ? 'checked' : ''}
                                       onchange="taskManager.toggleSubtask('${taskType}', ${task.id}, ${subtask.id})">
                                <span class="subtask-text">${this.escapeHtml(subtask.text)}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}
            </div>
        `).join('');

        this.updateProgress(taskType);
    }

    toggleTask(taskType, taskId) {
        const task = this.tasks[taskType].find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            // Si se marca la tarea, marcar todas las subtareas
            if (task.completed && task.subtasks) {
                task.subtasks.forEach(st => st.completed = true);
            }
            this.saveToStorage();
            this.renderTasks(taskType);
        }
    }

    toggleSubtask(taskType, taskId, subtaskId) {
        const task = this.tasks[taskType].find(t => t.id === taskId);
        if (task) {
            const subtask = task.subtasks.find(st => st.id === subtaskId);
            if (subtask) {
                subtask.completed = !subtask.completed;
                // Si todas las subtareas están completadas, marcar la tarea principal
                if (task.subtasks.every(st => st.completed)) {
                    task.completed = true;
                } else {
                    task.completed = false;
                }
                this.saveToStorage();
                this.renderTasks(taskType);
            }
        }
    }

    updateProgress(taskType) {
        const tasks = this.tasks[taskType];
        if (!tasks || tasks.length === 0) {
            document.getElementById(`${taskType}Progress`).textContent = '0% completado';
            return;
        }

        let totalItems = 0;
        let completedItems = 0;

        tasks.forEach(task => {
            totalItems++;
            if (task.completed) completedItems++;
            
            task.subtasks.forEach(subtask => {
                totalItems++;
                if (subtask.completed) completedItems++;
            });
        });

        const percentage = Math.round((completedItems / totalItems) * 100);
        document.getElementById(`${taskType}Progress`).textContent = `${percentage}% completado`;
    }

    resetTasks(taskType) {
        const taskNames = {
            daily: 'diarias',
            weekly: 'semanales',
            monthly: 'mensuales'
        };

        this.showModal(
            'Resetear Tareas',
            `¿Estás seguro de que quieres resetear todas las tareas ${taskNames[taskType]}? Se desmarcarán todas las tareas completadas.`,
            () => {
                this.tasks[taskType].forEach(task => {
                    task.completed = false;
                    task.subtasks.forEach(subtask => subtask.completed = false);
                });
                this.saveToStorage();
                this.renderTasks(taskType);
                this.setLastReset(taskType);
            }
        );
    }

    loadTasksFromFile(taskType) {
        document.getElementById(`${taskType}File`).click();
    }

    // Proyectos
    addNewProject() {
        document.getElementById('projectModal').classList.add('active');
        document.getElementById('projectName').value = '';
        document.getElementById('projectFileName').textContent = '';
    }

    handleProjectFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            document.getElementById('projectFileName').textContent = file.name;
        }
    }

    createProject() {
        const projectName = document.getElementById('projectName').value.trim();
        const fileInput = document.getElementById('projectFile');
        
        if (!projectName) {
            alert('Por favor, ingresa un nombre para el proyecto.');
            return;
        }

        const project = {
            id: Date.now(),
            name: projectName,
            tasks: [],
            createdAt: new Date().toISOString()
        };

        if (fileInput.files.length > 0) {
            const file = fileInput.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target.result;
                project.tasks = this.parseProjectTasks(content);
                this.projects.push(project);
                this.saveToStorage();
                this.renderProjects();
                this.closeProjectModal();
            };
            reader.readAsText(file);
        } else {
            this.projects.push(project);
            this.saveToStorage();
            this.renderProjects();
            this.closeProjectModal();
        }
    }

    parseProjectTasks(content) {
        const lines = content.split('\n');
        const tasks = [];
        let currentTask = null;

        lines.forEach(line => {
            if (!line.trim()) return;

            const tabCount = (line.match(/^\t*/)[0] || '').length;
            const text = line.trim();

            if (tabCount === 0) {
                currentTask = {
                    id: Date.now() + Math.random(),
                    text: text,
                    completed: false,
                    subtasks: []
                };
                tasks.push(currentTask);
            } else if (currentTask) {
                currentTask.subtasks.push({
                    id: Date.now() + Math.random(),
                    text: text,
                    completed: false
                });
            }
        });

        return tasks;
    }

    renderProjects() {
        const container = document.getElementById('projectsList');
        
        if (this.projects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📁</div>
                    <div class="empty-state-text">No hay proyectos. Crea un nuevo proyecto para comenzar.</div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.projects.map(project => {
            const progress = this.calculateProjectProgress(project);
            return `
                <div class="project-card">
                    <div class="project-header">
                        <h3 class="project-title">${this.escapeHtml(project.name)}</h3>
                        <div class="project-actions">
                            <button class="btn btn-primary" onclick="taskManager.viewProject(${project.id})">
                                Ver
                            </button>
                            <button class="btn btn-success" onclick="taskManager.archiveProject(${project.id})">
                                ✓ Finalizar
                            </button>
                        </div>
                    </div>
                    <div class="project-progress">${progress}% completado</div>
                    <div class="project-task-count">${project.tasks.length} tareas</div>
                </div>
            `;
        }).join('');
    }

    calculateProjectProgress(project) {
        if (!project.tasks || project.tasks.length === 0) return 0;

        let totalItems = 0;
        let completedItems = 0;

        project.tasks.forEach(task => {
            totalItems++;
            if (task.completed) completedItems++;
            
            task.subtasks.forEach(subtask => {
                totalItems++;
                if (subtask.completed) completedItems++;
            });
        });

        return Math.round((completedItems / totalItems) * 100);
    }

    viewProject(projectId) {
        const project = this.projects.find(p => p.id === projectId);
        if (!project) return;

        const modalContent = `
            <div style="max-height: 500px; overflow-y: auto;">
                <h3>${this.escapeHtml(project.name)}</h3>
                <div class="tasks-container" style="margin-top: 20px;">
                    ${project.tasks.map(task => `
                        <div class="task-item ${task.completed ? 'completed' : ''}">
                            <div class="task-header">
                                <input type="checkbox" 
                                       class="task-checkbox" 
                                       ${task.completed ? 'checked' : ''}
                                       onchange="taskManager.toggleProjectTask(${projectId}, ${task.id})">
                                <span class="task-text">${this.escapeHtml(task.text)}</span>
                            </div>
                            ${task.subtasks.length > 0 ? `
                                <div class="subtasks">
                                    ${task.subtasks.map(subtask => `
                                        <div class="subtask-item ${subtask.completed ? 'completed' : ''}">
                                            <input type="checkbox" 
                                                   class="subtask-checkbox" 
                                                   ${subtask.completed ? 'checked' : ''}
                                                   onchange="taskManager.toggleProjectSubtask(${projectId}, ${task.id}, ${subtask.id})">
                                            <span class="subtask-text">${this.escapeHtml(subtask.text)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions" style="margin-top: 20px;">
                <button class="btn btn-secondary" onclick="taskManager.closeModal()">Cerrar</button>
            </div>
        `;

        document.querySelector('#modal .modal-content').innerHTML = modalContent;
        document.getElementById('modal').classList.add('active');
    }

    toggleProjectTask(projectId, taskId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                task.completed = !task.completed;
                if (task.completed && task.subtasks) {
                    task.subtasks.forEach(st => st.completed = true);
                }
                this.saveToStorage();
                this.viewProject(projectId);
                this.renderProjects();
            }
        }
    }

    toggleProjectSubtask(projectId, taskId, subtaskId) {
        const project = this.projects.find(p => p.id === projectId);
        if (project) {
            const task = project.tasks.find(t => t.id === taskId);
            if (task) {
                const subtask = task.subtasks.find(st => st.id === subtaskId);
                if (subtask) {
                    subtask.completed = !subtask.completed;
                    if (task.subtasks.every(st => st.completed)) {
                        task.completed = true;
                    } else {
                        task.completed = false;
                    }
                    this.saveToStorage();
                    this.viewProject(projectId);
                    this.renderProjects();
                }
            }
        }
    }

    archiveProject(projectId) {
        this.showModal(
            'Archivar Proyecto',
            '¿Estás seguro de que quieres archivar este proyecto?',
            () => {
                const projectIndex = this.projects.findIndex(p => p.id === projectId);
                if (projectIndex !== -1) {
                    const project = this.projects[projectIndex];
                    project.archivedAt = new Date().toISOString();
                    this.archivedProjects.push(project);
                    this.projects.splice(projectIndex, 1);
                    this.saveToStorage();
                    this.renderProjects();
                    this.renderArchivedProjects();
                }
            }
        );
    }

    renderArchivedProjects() {
        const container = document.getElementById('archivedProjects');
        
        if (this.archivedProjects.length === 0) {
            container.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📦</div>
                    <div class="empty-state-text">No hay proyectos archivados.</div>
                </div>
            `;
            return;
        }

        container.innerHTML = this.archivedProjects.map(project => {
            const progress = this.calculateProjectProgress(project);
            const date = new Date(project.archivedAt).toLocaleDateString('es-ES');
            
            return `
                <div class="archived-card">
                    <div class="archived-header">
                        <h3 class="archived-title">${this.escapeHtml(project.name)}</h3>
                        <span class="archived-date">Archivado: ${date}</span>
                    </div>
                    <div class="project-progress">${progress}% completado</div>
                    <button class="btn btn-primary" onclick="taskManager.viewArchivedProject(${project.id})">
                        Ver Detalles
                    </button>
                </div>
            `;
        }).join('');
    }

    viewArchivedProject(projectId) {
        const project = this.archivedProjects.find(p => p.id === projectId);
        if (!project) return;

        const modalContent = `
            <div style="max-height: 500px; overflow-y: auto;">
                <h3>${this.escapeHtml(project.name)} (Archivado)</h3>
                <p style="color: #888; margin-bottom: 20px;">
                    Archivado el ${new Date(project.archivedAt).toLocaleDateString('es-ES')}
                </p>
                <div class="tasks-container">
                    ${project.tasks.map(task => `
                        <div class="task-item ${task.completed ? 'completed' : ''}">
                            <div class="task-header">
                                <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''} disabled>
                                <span class="task-text">${this.escapeHtml(task.text)}</span>
                            </div>
                            ${task.subtasks.length > 0 ? `
                                <div class="subtasks">
                                    ${task.subtasks.map(subtask => `
                                        <div class="subtask-item ${subtask.completed ? 'completed' : ''}">
                                            <input type="checkbox" class="subtask-checkbox" ${subtask.completed ? 'checked' : ''} disabled>
                                            <span class="subtask-text">${this.escapeHtml(subtask.text)}</span>
                                        </div>
                                    `).join('')}
                                </div>
                            ` : ''}
                        </div>
                    `).join('')}
                </div>
            </div>
            <div class="modal-actions" style="margin-top: 20px;">
                <button class="btn btn-secondary" onclick="taskManager.closeModal()">Cerrar</button>
            </div>
        `;

        document.querySelector('#modal .modal-content').innerHTML = modalContent;
        document.getElementById('modal').classList.add('active');
    }

    clearArchive() {
        this.showModal(
            'Limpiar Archivo',
            '¿Estás seguro de que quieres eliminar todos los proyectos archivados?',
            () => {
                this.archivedProjects = [];
                this.saveToStorage();
                this.renderArchivedProjects();
            }
        );
    }

    // Modal
    showModal(title, message, onConfirm) {
        document.getElementById('modalTitle').textContent = title;
        document.getElementById('modalMessage').textContent = message;
        document.getElementById('modal').classList.add('active');
        
        const confirmBtn = document.getElementById('modalConfirm');
        const newConfirmBtn = confirmBtn.cloneNode(true);
        confirmBtn.parentNode.replaceChild(newConfirmBtn, confirmBtn);
        
        newConfirmBtn.addEventListener('click', () => {
            onConfirm();
            this.closeModal();
        });
    }

    closeModal() {
        document.getElementById('modal').classList.remove('active');
        document.querySelector('#modal .modal-content').innerHTML = `
            <h3 id="modalTitle">Confirmación</h3>
            <p id="modalMessage"></p>
            <div class="modal-actions">
                <button class="btn btn-secondary" onclick="taskManager.closeModal()">Cancelar</button>
                <button class="btn btn-primary" id="modalConfirm">Confirmar</button>
            </div>
        `;
    }

    closeProjectModal() {
        document.getElementById('projectModal').classList.remove('active');
        document.getElementById('projectFile').value = '';
    }

    // Reseteos automáticos
    checkAutomaticResets() {
        const now = new Date();
        const lastResets = JSON.parse(localStorage.getItem('lastResets') || '{}');

        // Verificar reset diario
        if (lastResets.daily) {
            const lastReset = new Date(lastResets.daily);
            if (now.getDate() !== lastReset.getDate() || 
                now.getMonth() !== lastReset.getMonth() || 
                now.getFullYear() !== lastReset.getFullYear()) {
                this.promptReset('daily', 'diarias');
            }
        }

        // Verificar reset semanal (domingo)
        if (lastResets.weekly) {
            const lastReset = new Date(lastResets.weekly);
            const daysSince = Math.floor((now - lastReset) / (1000 * 60 * 60 * 24));
            if (now.getDay() === 0 && daysSince >= 7) {
                this.promptReset('weekly', 'semanales');
            }
        }

        // Verificar reset mensual
        if (lastResets.monthly) {
            const lastReset = new Date(lastResets.monthly);
            if (now.getMonth() !== lastReset.getMonth() || 
                now.getFullYear() !== lastReset.getFullYear()) {
                this.promptReset('monthly', 'mensuales');
            }
        }
    }

    promptReset(taskType, taskName) {
        this.showModal(
            'Reset Automático',
            `Ha finalizado el período de las tareas ${taskName}. ¿Deseas resetearlas ahora?`,
            () => {
                this.tasks[taskType].forEach(task => {
                    task.completed = false;
                    task.subtasks.forEach(subtask => subtask.completed = false);
                });
                this.saveToStorage();
                this.renderTasks(taskType);
                this.setLastReset(taskType);
            }
        );
    }

    setLastReset(taskType) {
        const lastResets = JSON.parse(localStorage.getItem('lastResets') || '{}');
        lastResets[taskType] = new Date().toISOString();
        localStorage.setItem('lastResets', JSON.stringify(lastResets));
    }

    // Almacenamiento
    async saveToStorage() {
        // Guardar en localStorage siempre (como respaldo)
        localStorage.setItem('tasks', JSON.stringify(this.tasks));
        localStorage.setItem('projects', JSON.stringify(this.projects));
        localStorage.setItem('archivedProjects', JSON.stringify(this.archivedProjects));
        
        // Guardar en Firebase si está habilitado
        if (firebaseEnabled && db) {
            try {
                const data = {
                    tasks: this.tasks,
                    projects: this.projects,
                    archivedProjects: this.archivedProjects,
                    lastResets: JSON.parse(localStorage.getItem('lastResets') || '{}'),
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp()
                };
                
                await db.collection('users').doc(this.userId).set(data);
                console.log('✅ Datos sincronizados con Firebase');
            } catch (error) {
                console.error('❌ Error al guardar en Firebase:', error);
            }
        }
        
        // Auto-guardar en archivo si está habilitado
        if (this.autoSaveEnabled) {
            this.saveToFile();
        }
    }

    async loadFromStorage() {
        // Cargar primero desde localStorage (más rápido)
        const tasks = localStorage.getItem('tasks');
        const projects = localStorage.getItem('projects');
        const archived = localStorage.getItem('archivedProjects');

        if (tasks) this.tasks = JSON.parse(tasks);
        if (projects) this.projects = JSON.parse(projects);
        if (archived) this.archivedProjects = JSON.parse(archived);
        
        // Si Firebase está habilitado, cargar desde allí (puede sobrescribir)
        if (firebaseEnabled && db) {
            try {
                const doc = await db.collection('users').doc(this.userId).get();
                
                if (doc.exists) {
                    const data = doc.data();
                    console.log('✅ Datos cargados desde Firebase');
                    
                    // Actualizar solo si hay datos más recientes
                    if (data.tasks) this.tasks = data.tasks;
                    if (data.projects) this.projects = data.projects;
                    if (data.archivedProjects) this.archivedProjects = data.archivedProjects;
                    if (data.lastResets) localStorage.setItem('lastResets', JSON.stringify(data.lastResets));
                    
                    // Guardar en localStorage como respaldo
                    localStorage.setItem('tasks', JSON.stringify(this.tasks));
                    localStorage.setItem('projects', JSON.stringify(this.projects));
                    localStorage.setItem('archivedProjects', JSON.stringify(this.archivedProjects));
                }
            } catch (error) {
                console.error('❌ Error al cargar desde Firebase:', error);
            }
        }
    }
    
    setupFirebaseSync() {
        // Configurar sincronización en tiempo real
        if (!firebaseEnabled || !db) return;
        
        console.log('🔄 Sincronización en tiempo real activada');
        
        // Escuchar cambios en tiempo real
        this.unsubscribeFirestore = db.collection('users').doc(this.userId)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    const data = doc.data();
                    
                    // Actualizar solo si los cambios vienen del servidor (no de este cliente)
                    if (!doc.metadata.hasPendingWrites) {
                        console.log('🔄 Datos actualizados desde otro dispositivo');
                        
                        if (data.tasks) this.tasks = data.tasks;
                        if (data.projects) this.projects = data.projects;
                        if (data.archivedProjects) this.archivedProjects = data.archivedProjects;
                        if (data.lastResets) localStorage.setItem('lastResets', JSON.stringify(data.lastResets));
                        
                        // Actualizar la interfaz
                        this.renderAll();
                    }
                }
            }, (error) => {
                console.error('❌ Error en sincronización:', error);
            });
    }

    renderAll() {
        this.renderTasks('daily');
        this.renderTasks('weekly');
        this.renderTasks('monthly');
        this.renderProjects();
        this.renderArchivedProjects();
    }

    // Exportar/Importar
    exportData() {
        const data = {
            tasks: this.tasks,
            projects: this.projects,
            archivedProjects: this.archivedProjects,
            lastResets: JSON.parse(localStorage.getItem('lastResets') || '{}'),
            exportDate: new Date().toISOString()
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `task-manager-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    }

    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;

            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    if (data.tasks) this.tasks = data.tasks;
                    if (data.projects) this.projects = data.projects;
                    if (data.archivedProjects) this.archivedProjects = data.archivedProjects;
                    if (data.lastResets) localStorage.setItem('lastResets', JSON.stringify(data.lastResets));

                    this.saveToStorage();
                    this.renderAll();
                    alert('Datos importados correctamente');
                } catch (error) {
                    alert('Error al importar los datos. Asegúrate de que el archivo sea válido.');
                    console.error(error);
                }
            };
            reader.readAsText(file);
        };
        input.click();
    }

    // Sistema de guardado en archivo
    async toggleAutoSave() {
        if (!this.autoSaveEnabled) {
            // Activar auto-guardado
            if ('showSaveFilePicker' in window) {
                // Usar File System Access API (Chrome/Edge moderno)
                try {
                    this.fileHandle = await window.showSaveFilePicker({
                        suggestedName: 'task-manager-data.json',
                        types: [{
                            description: 'JSON Files',
                            accept: { 'application/json': ['.json'] }
                        }]
                    });
                    this.autoSaveEnabled = true;
                    localStorage.setItem('autoSaveEnabled', 'true');
                    await this.saveToFile();
                    alert('✅ Auto-guardado activado. Los datos se guardarán automáticamente en el archivo seleccionado.');
                } catch (err) {
                    console.log('Usuario canceló la selección de archivo');
                    return;
                }
            } else {
                // Fallback: descargar archivo cada vez (navegadores antiguos)
                const confirm = window.confirm(
                    'Tu navegador no soporta guardado automático moderno.\n\n' +
                    '¿Deseas activar el modo de descarga automática?\n' +
                    '(Se descargará un archivo cada vez que hagas cambios)'
                );
                if (confirm) {
                    this.autoSaveEnabled = true;
                    localStorage.setItem('autoSaveEnabled', 'true');
                    alert('✅ Descarga automática activada.');
                } else {
                    return;
                }
            }
        } else {
            // Desactivar auto-guardado
            this.autoSaveEnabled = false;
            this.fileHandle = null;
            localStorage.setItem('autoSaveEnabled', 'false');
            alert('❌ Auto-guardado desactivado.');
        }
        this.updateAutoSaveButton();
    }

    async saveToFile() {
        const data = {
            tasks: this.tasks,
            projects: this.projects,
            archivedProjects: this.archivedProjects,
            lastResets: JSON.parse(localStorage.getItem('lastResets') || '{}'),
            lastSaved: new Date().toISOString()
        };
        
        const jsonString = JSON.stringify(data, null, 2);

        if (this.fileHandle && 'showSaveFilePicker' in window) {
            // Guardar usando File System Access API
            try {
                const writable = await this.fileHandle.createWritable();
                await writable.write(jsonString);
                await writable.close();
                console.log('✅ Datos guardados en archivo');
            } catch (err) {
                console.error('Error al guardar:', err);
                // Si falla, pedir nuevo archivo
                this.fileHandle = null;
                this.autoSaveEnabled = false;
                localStorage.setItem('autoSaveEnabled', 'false');
                this.updateAutoSaveButton();
            }
        } else if (this.autoSaveEnabled) {
            // Fallback: descargar archivo
            const blob = new Blob([jsonString], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `task-manager-data.json`;
            a.click();
            URL.revokeObjectURL(url);
        }
    }

    updateAutoSaveButton() {
        const btn = document.getElementById('autoSaveBtn');
        if (!btn) return;
        
        if (this.autoSaveEnabled) {
            btn.textContent = '💾 Auto-guardado: ON';
            btn.classList.add('active');
            btn.classList.remove('btn-secondary');
            btn.classList.add('btn-success');
        } else {
            btn.textContent = '💾 Auto-guardado: OFF';
            btn.classList.remove('active');
            btn.classList.remove('btn-success');
            btn.classList.add('btn-secondary');
        }
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
}

// Inicializar la aplicación
const taskManager = new TaskManager();
