/* ==========================================================================
   eSocial Brasil Review devs - Main JavaScript Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // --- State Variables ---
    let parsedData = {
        testerName: 'Testador não informado',
        extraTasks: 0,
        startDate: '2026-04-28',
        endDate: new Date().toISOString().split('T')[0],
        tasks: []
    };

    // --- DOM Elements ---
    const rawInput = document.getElementById('rawInput');
    const charCount = document.getElementById('charCount');
    const testerNameInput = document.getElementById('testerName');
    const extraTasksInput = document.getElementById('extraTasks');
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const fileInput = document.getElementById('fileInput');
    const fileUploadBox = document.getElementById('fileUploadBox');
    const dragDropOverlay = document.getElementById('dragDropOverlay');

    const btnProcess = document.getElementById('btnProcess');
    const btnTemplateTXT = document.getElementById('btnTemplateTXT');
    const btnTemplateJSON = document.getElementById('btnTemplateJSON');
    
    // Dashboard elements
    const dashboardSection = document.getElementById('dashboardSection');
    const generationTime = document.getElementById('generationTime');
    const kpiTotal = document.getElementById('kpiTotal');
    const kpiApproved = document.getElementById('kpiApproved');
    const kpiReproved = document.getElementById('kpiReproved');
    const kpiRate = document.getElementById('kpiRate');
    const kpiExtras = document.getElementById('kpiExtras');
    
    const ratingPanel = document.getElementById('ratingPanel');
    const displayTesterName = document.getElementById('displayTesterName');
    const displayPeriod = document.getElementById('displayPeriod');
    const displayScore = document.getElementById('displayScore');
    const displayRatingBadge = document.getElementById('displayRatingBadge');
    const displayFeedbackText = document.getElementById('displayFeedbackText');
    const displayRecommendations = document.getElementById('displayRecommendations');
    
    const executionTableBody = document.querySelector('#executionTable tbody');
    const approvedBreakdownList = document.getElementById('approvedBreakdownList');
    const reprovedBreakdownList = document.getElementById('reprovedBreakdownList');
    const countApprovedLabel = document.getElementById('countApprovedLabel');
    const countReprovedLabel = document.getElementById('countReprovedLabel');

    // Modal elements
    const previewModal = document.getElementById('previewModal');
    const btnPreviewModal = document.getElementById('btnPreviewModal');
    const btnCloseModal = document.getElementById('btnCloseModal');
    const btnDownloadPDF = document.getElementById('btnDownloadPDF');
    const btnModalDownload = document.getElementById('btnModalDownload');
    const pdfTemplateTarget = document.getElementById('pdfTemplateTarget');

    // Document elements inside Modal
    const docTester = document.getElementById('docTester');
    const docScore = document.getElementById('docScore');
    const docRating = document.getElementById('docRating');
    const docEmitDate = document.getElementById('docEmitDate');
    const docPeriod = document.getElementById('docPeriod');
    
    const docKpiTotal = document.getElementById('docKpiTotal');
    const docKpiApproved = document.getElementById('docKpiApproved');
    const docKpiReproved = document.getElementById('docKpiReproved');
    const docKpiRate = document.getElementById('docKpiRate');
    const docKpiExtras = document.getElementById('docKpiExtras');

    const docFeedbackCard = document.getElementById('docFeedbackCard');
    const docFeedbackBadge = document.getElementById('docFeedbackBadge');
    const docFeedbackDesc = document.getElementById('docFeedbackDesc');
    const docFeedbackRecs = document.getElementById('docFeedbackRecs');
    
    const docTableBody = document.querySelector('#docTable tbody');
    const docApprovedList = document.getElementById('docApprovedList');
    const docReprovedList = document.getElementById('docReprovedList');

    // Set Default End Date to current date
    const today = new Date().toISOString().split('T')[0];
    endDateInput.value = today;

    // Load and save tester name from cache (localStorage)
    const savedTesterName = localStorage.getItem('testerName');
    if (savedTesterName) {
        testerNameInput.value = savedTesterName;
    }
    testerNameInput.addEventListener('input', () => {
        localStorage.setItem('testerName', testerNameInput.value.trim());
    });

    // ==========================================================================
    // 🌌 Canvas Galaxy Particles Animation
    // ==========================================================================
    const canvas = document.getElementById('galaxyCanvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    const particleCount = 80;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.radius = Math.random() * 2 + 0.5;
            this.color = this.getRandomColor();
            this.speed = Math.random() * 0.15 + 0.05;
            this.angle = Math.random() * Math.PI * 2;
        }

        getRandomColor() {
            const colors = [
                'rgba(139, 92, 246, ', // violet
                'rgba(6, 182, 212, ',  // cyan
                'rgba(255, 255, 255, ', // white
                'rgba(168, 85, 247, '  // purple
            ];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const opacity = Math.random() * 0.5 + 0.1;
            return color + opacity + ')';
        }

        update() {
            this.x += Math.cos(this.angle) * this.speed;
            this.y += Math.sin(this.angle) * this.speed;

            // Fade in/out slightly near edges
            if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Initialize particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }

    function animateGalaxy() {
        ctx.fillStyle = 'rgba(4, 2, 10, 0.08)'; // Slight trail
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animateGalaxy);
    }
    animateGalaxy();

    // ==========================================================================
    // 📝 Templates & Character Counts
    // ==========================================================================
    const txtTemplate = 
`📌 CARD 01

NOME DO CARD: Ajustar dados da Avaliação de Riscos no documento PPR e adicionar sincronização geral
ID DO CARD: #10239
SERVIDOR: Produção
STATUS: ✔ APROVADO
O QUE FOI REALIZADO NO TESTE: Sincronização geral executada com sucesso no banco de dados e arquivos gerados corretamente.

📌 CARD 02

NOME DO CARD: Envio de lote de eventos para o governo federal
ID DO CARD: #10240
SERVIDOR: Homologação
STATUS: ❌ NEGADO
O QUE FOI REALIZADO NO TESTE: Retornou erro de conexão devido a falha no certificado de autenticação.

📊 RESULTADOS DO DIA
Aprovados: 1
Reprovados: 1
Total Testados: 2

🧪 TAREFAS EXTRAS TESTADAS
- Configuração do webhook de notificações
- Revisão de segurança nas rotas de admin`;

    const jsonTemplate = 
`{
  "extra_tasks": 3,
  "tasks": [
    {
      "id": "#10239",
      "task": "Ajustar dados da Avaliação de Riscos no documento PPR",
      "employee": "João Silva",
      "date": "15/06/2026",
      "status": "Aprovado",
      "note": "Sincronização geral executada com sucesso."
    },
    {
      "id": "#10240",
      "task": "Envio de lote de eventos",
      "employee": "Maria Santos",
      "date": "16/06/2026",
      "status": "Reprovado",
      "note": "Erro de certificado"
    }
  ]
}`;

    // Empty by default on startup
    rawInput.value = "";
    charCount.textContent = "0 caracteres";

    rawInput.addEventListener('input', () => {
        charCount.textContent = `${rawInput.value.length} caracteres`;
    });

    btnTemplateTXT.addEventListener('click', () => {
        rawInput.value = txtTemplate;
        charCount.textContent = `${txtTemplate.length} caracteres`;
    });

    btnTemplateJSON.addEventListener('click', () => {
        rawInput.value = jsonTemplate;
        charCount.textContent = `${jsonTemplate.length} caracteres`;
    });

    // ==========================================================================
    // 📂 File Upload & Drag and Drop Handling
    // ==========================================================================
    fileUploadBox.addEventListener('click', () => {
        fileInput.click();
    });

    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleUploadedFile(e.target.files[0]);
        }
    });

    // Drag and Drop
    const container = document.querySelector('.textarea-container');
    
    container.addEventListener('dragover', (e) => {
        e.preventDefault();
        dragDropOverlay.classList.add('active');
    });

    dragDropOverlay.addEventListener('dragleave', () => {
        dragDropOverlay.classList.remove('active');
    });

    dragDropOverlay.addEventListener('drop', (e) => {
        e.preventDefault();
        dragDropOverlay.classList.remove('active');
        if (e.dataTransfer.files.length > 0) {
            handleUploadedFile(e.dataTransfer.files[0]);
        }
    });

    function handleUploadedFile(file) {
        const reader = new FileReader();
        reader.onload = function(evt) {
            rawInput.value = evt.target.result;
            charCount.textContent = `${evt.target.result.length} caracteres`;
            
            // Try to auto-detect and populate metadata if JSON file loaded
            if (file.name.endsWith('.json')) {
                try {
                    const parsed = JSON.parse(evt.target.result);
                    if (parsed.extra_tasks !== undefined) {
                        extraTasksInput.value = parsed.extra_tasks;
                    }
                } catch(err) {
                    // Fail silently, just parsed as raw text
                }
            }
        };
        reader.readAsText(file);
    }

    // ==========================================================================
    // 🧠 Parser, Calculations and UI Render
    // ==========================================================================
    function cleanMarkdownAndEmojis(str) {
        if (!str) return '';
        // Remove Discord emojis (anything matching :emoji_name:)
        let cleaned = str.replace(/:[a-zA-Z0-9_~-]+:/g, '');
        // Remove markdown bold **
        cleaned = cleaned.replace(/\*\*/g, '');
        // Remove markdown headers ##
        cleaned = cleaned.replace(/##+/g, '');
        // Remove "TESTE 2" or "TESTE <N>" prefix/suffix (case-insensitive)
        cleaned = cleaned.replace(/teste\s*\d+\s*[:\-]?\s*/gi, '');
        return cleaned.trim();
    }

    function detectStatus(text) {
        if (!text) return null;
        const lower = text.toLowerCase();
        
        const reprovedSynonyms = [
            'reprovado', 'não aprovado', 'recusado', 'indeferido', 
            'desclassificado', 'inapto', 'não qualificado', 'eliminado', 
            'rejeitado', 'não aceito', 'insuficiente', 'fail', 'falhou', 
            'erro', 'falha', 'negado'
        ];
        
        const approvedSynonyms = [
            'aprovado', 'aceito', 'aprovado com êxito', 'homologado', 
            'validado', 'qualificado', 'admitido', 'deferido', 
            'satisfatório', 'confirmado', 'aceito oficialmente', 'pass', 
            'sucesso', 'ok'
        ];

        // 1. If text contains "status:", check only the part after "status:"
        if (lower.includes('status:')) {
            const statusPart = lower.split('status:')[1].trim();
            for (const syn of reprovedSynonyms) {
                if (statusPart.includes(syn)) return 'Reprovado';
            }
            for (const syn of approvedSynonyms) {
                if (statusPart.includes(syn)) return 'Aprovado';
            }
        }

        // 2. Otherwise, check the whole string
        for (const syn of reprovedSynonyms) {
            if (lower.includes(syn)) return 'Reprovado';
        }
        for (const syn of approvedSynonyms) {
            if (lower.includes(syn)) return 'Aprovado';
        }

        return null;
    }

    function parseInputText(text) {
        text = text.trim();
        if (!text) return [];

        // Check if input is JSON
        if (text.startsWith('{') || text.startsWith('[')) {
            try {
                const data = JSON.parse(text);
                let rawTasks = [];
                if (Array.isArray(data)) {
                    rawTasks = data;
                } else if (data.tasks && Array.isArray(data.tasks)) {
                    rawTasks = data.tasks;
                }
                
                return rawTasks.map(t => {
                    const statusVal = t.status || '';
                    const detected = detectStatus(statusVal) || detectStatus(t.task) || detectStatus(t.note) || 'Aprovado';
                    return {
                        id: cleanMarkdownAndEmojis(t.id),
                        task: cleanMarkdownAndEmojis(t.task),
                        employee: cleanMarkdownAndEmojis(t.employee),
                        date: cleanMarkdownAndEmojis(t.date),
                        status: detected,
                        note: cleanMarkdownAndEmojis(t.note || '')
                    };
                });
            } catch(e) {
                console.warn("JSON parsing failed, falling back to plain text parser.", e);
            }
        }

        // 1. If the text has block layout tags ("nome do card:" or "id do card:"), use Block Parser
        if (text.toLowerCase().includes('nome do card:') || text.toLowerCase().includes('id do card:')) {
            const lines = text.split('\n');
            const tasks = [];
            let currentTask = null;

            lines.forEach(line => {
                let originalLine = line;
                line = line.trim();
                if (!line) return;

                // Detect card indicator like "📌 CARD 01"
                if (line.match(/📌\s*CARD/i) || line.match(/^CARD\s*\d+/i)) {
                    if (currentTask && currentTask.id) {
                        tasks.push(currentTask);
                    }
                    currentTask = {
                        id: '',
                        task: '',
                        employee: testerNameInput.value || 'Testador não informado',
                        date: today,
                        status: 'Aprovado',
                        note: ''
                    };
                    return;
                }

                // If we hit metadata/summary section, stop reading cards
                if (line.toLowerCase().includes('resultados do dia') || line.toLowerCase().includes('tarefas extras testadas')) {
                    if (currentTask && currentTask.id) {
                        tasks.push(currentTask);
                        currentTask = null;
                    }
                    return;
                }

                if (!currentTask) {
                    // Try to initialize a task if fields appear before any 📌 CARD marker
                    if (line.toLowerCase().startsWith('nome do card:') || line.toLowerCase().startsWith('id do card:')) {
                        currentTask = {
                            id: '',
                            task: '',
                            employee: testerNameInput.value || 'Testador não informado',
                            date: today,
                            status: 'Aprovado',
                            note: ''
                        };
                    } else {
                        return;
                    }
                }

                const lower = line.toLowerCase();
                if (lower.startsWith('nome do card:') || lower.startsWith('nome:')) {
                    currentTask.task = cleanMarkdownAndEmojis(originalLine.split(/nome do card:|nome:/i)[1]);
                } else if (lower.startsWith('id do card:') || lower.startsWith('id:')) {
                    const idVal = originalLine.split(/id do card:|id:/i)[1].trim();
                    const idMatch = idVal.match(/#\d+/);
                    currentTask.id = idMatch ? idMatch[0] : cleanMarkdownAndEmojis(idVal);
                } else if (lower.startsWith('servidor:')) {
                    const srv = cleanMarkdownAndEmojis(originalLine.split(/servidor:/i)[1]);
                    if (srv) {
                        currentTask.note = currentTask.note ? `Servidor: ${srv} ; ${currentTask.note}` : `Servidor: ${srv}`;
                    }
                } else if (lower.startsWith('status:')) {
                    const st = originalLine.split(/status:/i)[1].trim();
                    currentTask.status = detectStatus(st) || 'Aprovado';
                } else if (lower.startsWith('o que foi realizado no teste:') || lower.startsWith('realizado:')) {
                    const act = cleanMarkdownAndEmojis(originalLine.split(/o que foi realizado no teste:|realizado:/i)[1]);
                    if (act) {
                        currentTask.note = currentTask.note ? `${currentTask.note} ; ${act}` : act;
                    }
                }
            });

            if (currentTask && currentTask.id) {
                tasks.push(currentTask);
            }
            return tasks;
        }

        // 2. Otherwise, use Line Parser
        const lines = text.split('\n');
        const tasks = [];

        lines.forEach(line => {
            let originalLine = line;
            line = line.trim();
            if (!line) return; // Skip empty lines

            // Ignore markdown headers that are not followed by numbers
            if (line.startsWith('#') && !line.match(/^#\d+/)) {
                return;
            }

            // Ignore table headers
            if (line.toLowerCase().includes('tarefa') && line.toLowerCase().includes('status')) return;
            if (line.startsWith('---')) return;

            // Split by standard delimiters
            let parts = [];
            if (line.includes('|')) {
                parts = line.split('|').map(p => p.trim());
            } else if (line.includes(';')) {
                parts = line.split(';').map(p => p.trim());
            } else if (line.includes('\t')) {
                parts = line.split('\t').map(p => p.trim());
            }

            // Check if this is a sub-line / detail block (starts with └, L, -, or *)
            const isSubLine = line.startsWith('└') || line.startsWith('L ') || line.startsWith('L Teste') || line.startsWith('-') || line.startsWith('*');

            // CRITICAL RULE: A line must have a test ID #\d+ or be a subline, otherwise we ignore it!
            if (!line.match(/#\d+/) && !isSubLine) {
                return;
            }

            if (parts.length >= 3) {
                let rawId = cleanMarkdownAndEmojis(parts[0]);
                let task = cleanMarkdownAndEmojis(parts[1]);
                let employee = cleanMarkdownAndEmojis(parts[2]);
                let date = cleanMarkdownAndEmojis(parts[3] || today);
                let statusVal = parts[4] || '';
                let note = cleanMarkdownAndEmojis(parts[5] || '');

                let id = rawId;
                // If the ID column contains a pattern like "#12345 - Description text", split it!
                if (rawId.match(/#\d+/)) {
                    const match = rawId.match(/(#\d+)(?:\s*[\-:]\s*|\s+)(.*)/);
                    if (match) {
                        id = match[1];
                        const taskExtra = match[2];
                        task = task ? `${taskExtra} - ${task}` : taskExtra;
                    }
                }

                // Detect status from status field, then note, then task, then fall back to Aprovado
                let statusValCleaned = cleanMarkdownAndEmojis(statusVal);
                let detectedStatus = detectStatus(statusValCleaned) || detectStatus(note) || detectStatus(task) || 'Aprovado';

                // If it is a subline/detail row and we have a previous task, merge it
                if (isSubLine && tasks.length > 0) {
                    const prevTask = tasks[tasks.length - 1];
                    const details = [task, employee, note].filter(x => x && x !== 'OK').join(' | ');
                    if (details) {
                        prevTask.note = (prevTask.note && prevTask.note !== 'OK') ? `${prevTask.note} ; ${details}` : details;
                    }
                    if (detectedStatus === 'Reprovado') {
                        prevTask.status = 'Reprovado';
                    }
                    return;
                }

                tasks.push({
                    id: id || `#${Math.floor(1000 + Math.random()*9000)}`,
                    task: task || 'Tarefa de Teste',
                    employee: employee || testerNameInput.value || 'Testador não informado',
                    date: date,
                    status: detectedStatus,
                    note: note || (detectedStatus === 'Aprovado' ? 'OK' : 'Falha identificada')
                });
            } else {
                const textVal = cleanMarkdownAndEmojis(line);
                if (!textVal) return;

                // Check if subline
                if (isSubLine && tasks.length > 0) {
                    const prevTask = tasks[tasks.length - 1];
                    const cleanedSubText = textVal.replace(/^[└L\-\*\s]+/, '').trim();
                    if (cleanedSubText) {
                        prevTask.note = (prevTask.note && prevTask.note !== 'OK') ? `${prevTask.note} ; ${cleanedSubText}` : cleanedSubText;
                    }
                    if (detectStatus(originalLine) === 'Reprovado') {
                        prevTask.status = 'Reprovado';
                    }
                    return;
                }

                // Normal fallback parsing
                const idMatch = line.match(/#\d+/);
                const dateMatch = line.match(/\b\d{2}[/-]\d{2}[/-]\d{4}\b/);
                
                let id = idMatch ? idMatch[0] : `#${Math.floor(1000 + Math.random()*9000)}`;
                const date = dateMatch ? dateMatch[0] : today;
                
                // Detect status from the cleaned text or original line
                let status = detectStatus(originalLine) || 'Aprovado';

                let cleanedLine = line.replace(idMatch ? idMatch[0] : '', '').replace(date, '');
                cleanedLine = cleanMarkdownAndEmojis(cleanedLine);

                // If the remaining text starts with "- Description", clean that punctuation
                cleanedLine = cleanedLine.replace(/^[\-:\s]+/, '');

                if (cleanedLine.length < 3 && !idMatch) return; // Skip noise

                tasks.push({
                    id: id,
                    task: cleanedLine || 'Tarefa de Teste',
                    employee: testerNameInput.value || 'João Silva',
                    date: date,
                    status: status,
                    note: status === 'Aprovado' ? 'OK' : 'Falha identificada'
                });
            }
        });

        return tasks;
    }

    function formatDate(dateString) {
        if (!dateString) return '--/--/----';
        // Check if already in DD/MM/YYYY format
        if (/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return dateString;
        try {
            const parts = dateString.split('-');
            if (parts.length === 3) {
                return `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        } catch(e) {}
        return dateString;
    }

    function getFeedbackDetails(score) {
        if (score <= 30) {
            return {
                bandClass: 'band-red',
                docBandClass: 'doc-band-red',
                rating: 'Baixo desempenho',
                evaluation: 'O desempenho está abaixo do esperado para o nível de execução das tarefas.',
                recommendations: 'Revisar os conceitos básicos e realizar novas execuções com mais atenção aos detalhes.'
            };
        } else if (score <= 70) {
            return {
                bandClass: 'band-orange',
                docBandClass: 'doc-band-orange',
                rating: 'Bom desempenho',
                evaluation: 'O desempenho está dentro do esperado, mas ainda apresenta inconsistências em algumas execuções.',
                recommendations: 'Atenção maior na validação das tarefas antes de finalizá-las e prática contínua para evolução.'
            };
        } else if (score <= 100) {
            return {
                bandClass: 'band-yellow',
                docBandClass: 'doc-band-yellow',
                rating: 'Muito bom desempenho',
                evaluation: 'O desempenho está bom, com boa consistência na execução das tarefas.',
                recommendations: 'Manter o padrão atual e continuar praticando para aprimorar ainda mais a precisão.'
            };
        } else {
            return {
                bandClass: 'band-green',
                docBandClass: 'doc-band-green',
                rating: 'Excelente desempenho',
                evaluation: 'O desempenho está excelente, com alto nível de consistência e qualidade.',
                recommendations: 'Continuar mantendo o padrão atual e explorar tarefas mais avançadas para evolução contínua.'
            };
        }
    }

    btnProcess.addEventListener('click', () => {
        const rawText = rawInput.value;
        const tester = testerNameInput.value.trim() || 'Testador não informado';
        const extraTasks = parseInt(extraTasksInput.value, 10) || 0;
        const start = startDateInput.value;
        const end = endDateInput.value;

        // Parse
        const tasks = parseInputText(rawText);
        if (tasks.length === 0) {
            alert("Nenhum caso de teste pôde ser parseado. Por favor insira dados válidos.");
            return;
        }

        // Calculate KPI values
        const total = tasks.length;
        const approved = tasks.filter(t => t.status === 'Aprovado').length;
        const reproved = tasks.filter(t => t.status === 'Reprovado').length;
        const rate = total > 0 ? Math.round((approved / total) * 100) : 0;
        
        // Calculations rules:
        // nota = (aprovados * 10) + (reprovados * 2) + (extra_tasks * 5)
        const score = (approved * 10) + (reproved * 2) + (extraTasks * 5);
        const feedback = getFeedbackDetails(score);

        // Update State
        parsedData = {
            testerName: tester,
            extraTasks: extraTasks,
            startDate: start,
            endDate: end,
            tasks: tasks,
            kpis: { total, approved, reproved, rate, extraTasks },
            score: score,
            feedback: feedback
        };

        // Render Dashboard
        renderDashboard();
    });

    function renderDashboard() {
        const data = parsedData;
        
        // Set generation metadata
        const now = new Date();
        generationTime.textContent = `Gerado em: ${now.toLocaleDateString('pt-BR')} ${now.toLocaleTimeString('pt-BR')}`;

        // KPIs
        kpiTotal.textContent = data.kpis.total;
        kpiApproved.textContent = data.kpis.approved;
        kpiReproved.textContent = data.kpis.reproved;
        kpiRate.textContent = `${data.kpis.rate}%`;
        kpiExtras.textContent = data.kpis.extraTasks;

        // Rating panel classes
        ratingPanel.className = `glass-panel rating-panel ${data.feedback.bandClass}`;
        displayTesterName.textContent = data.testerName;
        displayPeriod.textContent = `${formatDate(data.startDate)} a ${formatDate(data.endDate)}`;
        displayScore.textContent = data.score;
        displayRatingBadge.textContent = data.feedback.rating;
        displayFeedbackText.textContent = data.feedback.evaluation;
        displayRecommendations.textContent = data.feedback.recommendations;

        // Clear Lists & Tables
        executionTableBody.innerHTML = '';
        approvedBreakdownList.innerHTML = '';
        reprovedBreakdownList.innerHTML = '';

        countApprovedLabel.textContent = data.kpis.approved;
        countReprovedLabel.textContent = data.kpis.reproved;

        // Render rows and breakdown cards
        data.tasks.forEach(t => {
            // Execution Table Row
            const row = document.createElement('tr');
            
            const badgeClass = t.status === 'Aprovado' ? 'aprovado' : 'reprovado';
            const statusIcon = t.status === 'Aprovado' ? 'check' : 'alert-circle';
            
            row.innerHTML = `
                <td><strong>${t.id}</strong></td>
                <td>${t.task}</td>
                <td>${t.employee}</td>
                <td>${formatDate(t.date)}</td>
                <td><span class="status-badge ${badgeClass}"><i data-lucide="${statusIcon}" class="icon-xs"></i> ${t.status}</span></td>
                <td><span class="note-text">${t.note || ''}</span></td>
            `;
            executionTableBody.appendChild(row);

            // Details Breakdown Card list
            const li = document.createElement('li');
            li.innerHTML = `
                <strong>${t.id} - ${t.task}</strong>
                <span class="meta">Responsável: ${t.employee} | Data: ${formatDate(t.date)}</span>
                ${t.note ? `<p class="note">${t.note}</p>` : ''}
            `;

            if (t.status === 'Aprovado') {
                approvedBreakdownList.appendChild(li);
            } else {
                reprovedBreakdownList.appendChild(li);
            }
        });

        // Dynamic Lucide update for injected elements
        if (window.lucide) {
            window.lucide.createIcons({
                attrs: {
                    class: 'icon-xs'
                }
            });
        }

        // Show Dashboard
        dashboardSection.style.display = 'block';
        dashboardSection.scrollIntoView({ behavior: 'smooth' });
    }

    // ==========================================================================
    // 🖨️ A4 Preview & PDF Generation Integration
    // ==========================================================================
    function populateModalA4() {
        const data = parsedData;
        const now = new Date();

        // Metadata
        docTester.textContent = data.testerName;
        docScore.textContent = `${data.score} pts`;
        docRating.textContent = data.feedback.rating;
        docEmitDate.textContent = now.toLocaleDateString('pt-BR');
        docPeriod.textContent = `${formatDate(data.startDate)} a ${formatDate(data.endDate)}`;

        // KPIs
        docKpiTotal.textContent = data.kpis.total;
        docKpiApproved.textContent = data.kpis.approved;
        docKpiReproved.textContent = data.kpis.reproved;
        docKpiRate.textContent = `${data.kpis.rate}%`;
        docKpiExtras.textContent = data.kpis.extraTasks;

        // Feedback Section
        docFeedbackCard.className = `doc-feedback-card ${data.feedback.docBandClass}`;
        docFeedbackBadge.textContent = data.feedback.rating;
        docFeedbackDesc.textContent = data.feedback.evaluation;
        docFeedbackRecs.textContent = data.feedback.recommendations;

        // Execution Table
        docTableBody.innerHTML = '';
        data.tasks.forEach(t => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${t.id}</td>
                <td>${t.task}</td>
                <td>${t.employee}</td>
                <td>${formatDate(t.date)}</td>
                <td style="font-weight: bold; color: ${t.status === 'Aprovado' ? '#047857' : '#b91c1c'};">${t.status}</td>
            `;
            docTableBody.appendChild(tr);
        });

        // Status Details list
        docApprovedList.innerHTML = '';
        docReprovedList.innerHTML = '';

        const approvedTasks = data.tasks.filter(t => t.status === 'Aprovado');
        const reprovedTasks = data.tasks.filter(t => t.status === 'Reprovado');

        if (approvedTasks.length > 0) {
            approvedTasks.forEach(t => {
                const li = document.createElement('li');
                li.textContent = `${t.task} (ID: ${t.id} — ${t.note || 'OK'})`;
                docApprovedList.appendChild(li);
            });
        } else {
            docApprovedList.innerHTML = '<li>Nenhum teste aprovado</li>';
        }

        if (reprovedTasks.length > 0) {
            reprovedTasks.forEach(t => {
                const li = document.createElement('li');
                li.textContent = `${t.task} (ID: ${t.id} — Motivo: ${t.note || 'Sem detalhes'})`;
                docReprovedList.appendChild(li);
            });
        } else {
            docReprovedList.innerHTML = '<li>Nenhum teste reprovado</li>';
        }
    }

    // Modal Control
    btnPreviewModal.addEventListener('click', () => {
        populateModalA4();
        previewModal.classList.add('open');
    });

    btnCloseModal.addEventListener('click', () => {
        previewModal.classList.remove('open');
    });

    // Close on clicking backdrop
    previewModal.addEventListener('click', (e) => {
        if (e.target === previewModal) {
            previewModal.classList.remove('open');
        }
    });

    // Export PDF function
    function downloadPDFReport() {
        populateModalA4(); // Ensure populated
        
        const opt = {
            margin: 0,
            filename: `esocial-review-devs-${parsedData.testerName.replace(/\s+/g, '-').toLowerCase()}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { 
                scale: 2.5, 
                useCORS: true,
                letterRendering: true,
                backgroundColor: '#ffffff'
            },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Create a clone of the target print template in a hidden container to make it clean
        const element = pdfTemplateTarget;
        
        // Execute download
        html2pdf().set(opt).from(element).save();
    }

    btnDownloadPDF.addEventListener('click', downloadPDFReport);
    btnModalDownload.addEventListener('click', downloadPDFReport);
});
