/* ==========================================================================
   eSocial Brasil Review devs - Main JavaScript Application
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize Lucide Icons
    if (window.lucide) {
        window.lucide.createIcons();
    }

    // --- Toast Notification System ---
    function showToast(message, type = 'error') {
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const iconName = type === 'error' ? 'alert-triangle' : 'info';

        toast.innerHTML = `
            <div class="toast-icon">
                <i data-lucide="${iconName}"></i>
            </div>
            <div class="toast-content">
                <span class="toast-title">${type === 'error' ? 'Erro' : 'Aviso'}</span>
                <span class="toast-message">${message}</span>
            </div>
            <button class="toast-close">
                <i data-lucide="x" class="icon-xs"></i>
            </button>
        `;

        container.appendChild(toast);

        if (window.lucide) {
            window.lucide.createIcons({ root: toast });
        }

        const closeBtn = toast.querySelector('.toast-close');

        const removeToast = () => {
            toast.classList.add('closing');
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        };

        closeBtn.addEventListener('click', removeToast);

        // Auto remove after 5 seconds
        setTimeout(removeToast, 5000);
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
    const scoreInfoModal = document.getElementById('scoreInfoModal');
    const btnHelpScore = document.getElementById('btnHelpScore');
    const btnCloseScoreModal = document.getElementById('btnCloseScoreModal');
    const btnDownloadPDF = document.getElementById('btnDownloadPDF');
    const btnModalDownload = document.getElementById('btnModalDownload');

    const pdfTemplateTarget = document.getElementById('pdfTemplateTarget');
    const btnDownloadTemplateTXT = document.getElementById('btnDownloadTemplateTXT');

    // History Modal elements
    const historyModal = document.getElementById('historyModal');
    const btnHistory = document.getElementById('btnHistory');
    const btnCloseHistory = document.getElementById('btnCloseHistory');
    const historyTableBody = document.getElementById('historyTableBody');
    const historyTable = document.getElementById('historyTable');
    const historyEmptyState = document.getElementById('historyEmptyState');
    const historyCount = document.getElementById('historyCount');
    const btnClearHistory = document.getElementById('btnClearHistory');

    // Clear Confirm Modal elements
    const clearConfirmModal = document.getElementById('clearConfirmModal');
    const btnConfirmClear = document.getElementById('btnConfirmClear');
    const btnCancelClear = document.getElementById('btnCancelClear');
    const btnCancelClearClose = document.getElementById('btnCancelClearClose');

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
    const docFeedbackScore = document.getElementById('docFeedbackScore');
    const docFeedbackBadge = document.getElementById('docFeedbackBadge');
    const docFeedbackDesc = document.getElementById('docFeedbackDesc');
    const docFeedbackRecs = document.getElementById('docFeedbackRecs');

    const docTableBody = document.querySelector('#docTable tbody');
    const docApprovedList = document.getElementById('docApprovedList');
    const docReprovedList = document.getElementById('docReprovedList');

    const docExtraTasksSection = document.getElementById('docExtraTasksSection');
    const docExtraTasksList = document.getElementById('docExtraTasksList');

    // Set Default Start Date to current date; End Date left empty for manual input
    const today = new Date().toISOString().split('T')[0];
    startDateInput.value = today;
    endDateInput.value = '';

    // Load and save tester name from cache (localStorage)
    const savedTesterName = localStorage.getItem('testerName');
    if (savedTesterName) {
        testerNameInput.value = savedTesterName;
    }
    testerNameInput.addEventListener('input', () => {
        localStorage.setItem('testerName', testerNameInput.value.trim());
    });

    // Galaxy animation removed as requested.

    // ==========================================================================
    // 📝 Templates & Character Counts
    // ==========================================================================
    const txtTemplate =
        `📌 CARD 01

Nome do card: 
ID do card: 
Servidor: 
Status: (APROVADO / NEGADO) 
Observação teste: 

📌 CARD 02

Nome do card: 
ID do card: 
Servidor: 
Status: (APROVADO / NEGADO)
Observação teste: 

📊 RESULTADOS DO DIA
Aprovados: 
Reprovados: 
Total Testados: 

🧪 TAREFAS EXTRAS TESTADAS
- 
- `;

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

    btnDownloadTemplateTXT.addEventListener('click', () => {
        const blob = new Blob([txtTemplate], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'modelo_relatorio_testes.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
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

    // Drag and Drop on Textarea Container
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

    // Drag and Drop directly on File Upload Box
    fileUploadBox.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUploadBox.style.borderColor = 'rgba(156, 206, 195, 0.9)';
        fileUploadBox.style.background = 'rgba(156, 206, 195, 0.08)';
    });

    fileUploadBox.addEventListener('dragleave', () => {
        fileUploadBox.style.borderColor = '';
        fileUploadBox.style.background = '';
    });

    fileUploadBox.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUploadBox.style.borderColor = '';
        fileUploadBox.style.background = '';
        if (e.dataTransfer.files.length > 0) {
            handleUploadedFile(e.dataTransfer.files[0]);
        }
    });

    function clearUploadedFile() {
        fileInput.value = '';
        rawInput.value = '';
        charCount.textContent = '0 caracteres';

        fileUploadBox.classList.remove('uploaded');
        const uploadInner = fileUploadBox.querySelector('.upload-inner');
        if (uploadInner) {
            uploadInner.innerHTML = `
                <i data-lucide="upload" class="upload-icon"></i>
                <span>Arraste ou clique para enviar arquivo TXT</span>
            `;
            if (window.lucide) {
                window.lucide.createIcons({ root: fileUploadBox });
            }
        }
        showToast("Arquivo removido", "info");
    }

    function handleUploadedFile(file) {
        if (!file.name.endsWith('.txt')) {
            showToast("Formato de arquivo inválido. Por favor, envie um arquivo .txt", "error");
            return;
        }

        const reader = new FileReader();
        reader.onload = function (evt) {
            const fileContent = evt.target.result;
            rawInput.value = fileContent;
            charCount.textContent = `${fileContent.length} caracteres`;

            // Visual Feedback in File Upload Box
            fileUploadBox.classList.add('uploaded');
            const uploadInner = fileUploadBox.querySelector('.upload-inner');
            if (uploadInner) {
                uploadInner.innerHTML = `
                    <div class="file-active-state">
                        <i data-lucide="file-text" class="upload-icon-large"></i>
                        <span class="file-name-label" title="${file.name}">${file.name}</span>
                        <span class="file-subtext">Pronto para processar</span>
                        <button type="button" class="btn-remove-file" id="btnRemoveFile" title="Remover arquivo">
                            <i data-lucide="x"></i>
                        </button>
                    </div>
                `;
                if (window.lucide) {
                    window.lucide.createIcons({ root: fileUploadBox });
                }

                // Bind remove button click
                const btnRemove = uploadInner.querySelector('#btnRemoveFile');
                if (btnRemove) {
                    btnRemove.addEventListener('click', (e) => {
                        e.stopPropagation();
                        e.preventDefault();
                        clearUploadedFile();
                    });
                }
            }

            showToast(`Arquivo "${file.name}" carregado com sucesso!`, "success");

            // Reset input value to allow uploading the same file again if needed
            fileInput.value = '';
        };
        reader.onerror = function () {
            showToast("Erro ao ler o arquivo. Tente novamente.", "error");
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

        // 1. If the text has block layout tags ("nome do card:" or "id do card:"), use Block Parser
        if (text.toLowerCase().includes('nome do card:') || text.toLowerCase().includes('id do card:')) {
            const lines = text.split('\n');
            const tasks = [];
            let currentTask = null;
            let parsingExtraTasks = false;
            let extraTasksTextList = [];

            lines.forEach(line => {
                let originalLine = line;
                line = line.trim();
                if (!line) return;

                if (parsingExtraTasks) {
                    if (line.match(/📌\s*CARD/i) || line.match(/^CARD\s*\d+/i)) {
                        parsingExtraTasks = false;
                    } else if (line.startsWith('-') || line.startsWith('*')) {
                        const content = line.substring(1).trim();
                        const cleaned = cleanMarkdownAndEmojis(content);
                        if (cleaned && cleaned !== '-' && cleaned !== '*') {
                            extraTasksTextList.push(cleaned);
                        }
                    }
                    return;
                }

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
                        server: 'Não informado',
                        status: 'Aprovado',
                        note: ''
                    };
                    return;
                }

                // If we hit metadata/summary section, stop reading cards but maybe read extras
                if (line.toLowerCase().includes('resultados do dia')) {
                    if (currentTask && currentTask.id) {
                        tasks.push(currentTask);
                        currentTask = null;
                    }
                    return;
                }

                if (line.toLowerCase().includes('tarefas extras testadas') || line.toLowerCase().includes('tarefas extras')) {
                    if (currentTask && currentTask.id) {
                        tasks.push(currentTask);
                        currentTask = null;
                    }
                    parsingExtraTasks = true;
                    return;
                }

                if (!currentTask && !parsingExtraTasks) {
                    // Try to initialize a task if fields appear before any 📌 CARD marker
                    if (line.toLowerCase().startsWith('nome do card:') || line.toLowerCase().startsWith('id do card:')) {
                        currentTask = {
                            id: '',
                            task: '',
                            employee: testerNameInput.value || 'Testador não informado',
                            date: today,
                            server: 'Não informado',
                            status: 'Aprovado',
                            note: ''
                        };
                    } else {
                        return;
                    }
                }

                if (!currentTask) return;

                const lower = line.toLowerCase();
                if (lower.startsWith('nome do card:') || lower.startsWith('nome:')) {
                    currentTask.task = cleanMarkdownAndEmojis(originalLine.split(/nome do card:|nome:/i)[1]);
                } else if (lower.startsWith('id do card:') || lower.startsWith('id:')) {
                    const idVal = originalLine.split(/id do card:|id:/i)[1].trim();
                    const idMatch = idVal.match(/#\d+/);
                    currentTask.id = idMatch ? idMatch[0] : cleanMarkdownAndEmojis(idVal);
                } else if (lower.startsWith('servidor:')) {
                    currentTask.server = cleanMarkdownAndEmojis(originalLine.split(/servidor:/i)[1]) || 'Não informado';
                } else if (lower.startsWith('status:')) {
                    const st = originalLine.split(/status:/i)[1].trim();
                    currentTask.status = detectStatus(st) || 'Aprovado';
                } else if (lower.startsWith('o que foi realizado no teste:') || lower.startsWith('realizado:') || lower.startsWith('observação teste:') || lower.startsWith('observacao teste:')) {
                    const act = cleanMarkdownAndEmojis(originalLine.split(/o que foi realizado no teste:|realizado:|observação teste:|observacao teste:/i)[1]);
                    if (act) {
                        currentTask.note = currentTask.note ? `${currentTask.note} ; ${act}` : act;
                    }
                }
            });

            if (currentTask && currentTask.id) {
                tasks.push(currentTask);
            }
            return { tasks, extraTasksTextList };
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
                    id: id || `#${Math.floor(1000 + Math.random() * 9000)}`,
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

                let id = idMatch ? idMatch[0] : `#${Math.floor(1000 + Math.random() * 9000)}`;
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

        return { tasks, extraTasksTextList: [] };
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
        } catch (e) { }
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
        const parseResult = parseInputText(rawText);
        const tasks = Array.isArray(parseResult) ? parseResult : parseResult.tasks;
        const extraTasksList = (parseResult && parseResult.extraTasksTextList) ? parseResult.extraTasksTextList : [];

        if (!tasks || tasks.length === 0) {
            showToast("Nenhum caso de teste pôde ser parseado. Por favor insira dados válidos.", "error");
            return;
        }

        // Calculate KPI values
        const total = tasks.length;
        const approved = tasks.filter(t => t.status === 'Aprovado').length;
        const reproved = tasks.filter(t => t.status === 'Reprovado').length;
        const rate = total > 0 ? Math.round((approved / total) * 100) : 0;

        // Se extraTasks for preenchido via input manualmente usamos ele, senao da listagem
        const extraTasksCount = extraTasks > 0 ? extraTasks : extraTasksList.length;

        // Calculations rules:
        // nota = (total_testes * 10) + (extra_tasks * 5)
        // Cada teste realizado vale 10 pontos (aprovado ou reprovado), extras valem 5.
        const score = (total * 10) + (extraTasksCount * 5);
        const feedback = getFeedbackDetails(score);

        // Update State
        parsedData = {
            testerName: tester,
            extraTasks: extraTasksCount,
            extraTasksList: extraTasksList,
            startDate: start,
            endDate: end,
            tasks: tasks,
            kpis: { total, approved, reproved, rate, extraTasks: extraTasksCount },
            score: score,
            feedback: feedback,
            rawText: rawText
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
        let periodText = 'Não informado';
        if (data.startDate && data.endDate) {
            periodText = `${formatDate(data.startDate)} a ${formatDate(data.endDate)}`;
        } else if (data.startDate) {
            periodText = `A partir de ${formatDate(data.startDate)}`;
        } else if (data.endDate) {
            periodText = `Até ${formatDate(data.endDate)}`;
        }
        displayPeriod.textContent = periodText;
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
                <td>${t.server || 'Não informado'}</td>
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
        let periodText = 'Não informado';
        if (data.startDate && data.endDate) {
            periodText = `${formatDate(data.startDate)} a ${formatDate(data.endDate)}`;
        } else if (data.startDate) {
            periodText = `A partir de ${formatDate(data.startDate)}`;
        } else if (data.endDate) {
            periodText = `Até ${formatDate(data.endDate)}`;
        }
        docPeriod.textContent = periodText;

        // KPIs
        docKpiTotal.textContent = data.kpis.total;
        docKpiApproved.textContent = data.kpis.approved;
        docKpiReproved.textContent = data.kpis.reproved;
        docKpiRate.textContent = `${data.kpis.rate}%`;
        docKpiExtras.textContent = data.kpis.extraTasks;

        // Feedback Section
        docFeedbackCard.className = `doc-feedback-card ${data.feedback.docBandClass}`;
        if (docFeedbackScore) {
            docFeedbackScore.textContent = data.score;
        }
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
                <td>${t.server || 'Não informado'}</td>
                <td style="font-weight: bold; color: ${t.status === 'Aprovado' ? '#047857' : '#b91c1c'};">${t.status}</td>
            `;
            docTableBody.appendChild(tr);
        });

        // Extra Tasks Section
        docExtraTasksList.innerHTML = '';
        if (data.extraTasksList && data.extraTasksList.length > 0) {
            docExtraTasksSection.style.display = 'block';
            data.extraTasksList.forEach(taskStr => {
                const li = document.createElement('li');
                li.textContent = taskStr;
                docExtraTasksList.appendChild(li);
            });
        } else {
            docExtraTasksSection.style.display = 'none';
        }

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

    // Referência ao previewContent editável
    const previewContent = document.getElementById('previewContent');

    // Modal Control — abre e carrega o conteúdo no editor
    btnPreviewModal.addEventListener('click', () => {
        populateModalA4();
        // Copia o HTML do template para o preview editável
        if (previewContent) {
            previewContent.innerHTML = pdfTemplateTarget.querySelector('.document-content').innerHTML;
        }
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

    // Score Info Modal Control
    btnHelpScore.addEventListener('click', () => {
        scoreInfoModal.classList.add('open');
    });

    btnCloseScoreModal.addEventListener('click', () => {
        scoreInfoModal.classList.remove('open');
    });

    scoreInfoModal.addEventListener('click', (e) => {
        if (e.target === scoreInfoModal) {
            scoreInfoModal.classList.remove('open');
        }
    });

    // =========================================================================
    // 🖨️ PDF Export — Native print in new tab (window.print)
    // =========================================================================
    function generatePdfPrint(sourceElement) {
        const today = new Date();
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = today.getFullYear();
        const filename = `Tarefas Testadas - ( ${parsedData.testerName} ) - ${day}-${month}-${year}`;

        const printWindow = window.open('', '_blank');
        if (!printWindow) {
            showToast('Por favor, permita pop-ups para visualizar a impressão.', 'error');
            return;
        }

        // Capture the fully-rendered inner HTML from the live DOM element
        const contentHtml = sourceElement.querySelector('.document-content').innerHTML;

        printWindow.document.write(`
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <title>${filename}</title>
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@400;500;600;700;800&display=swap" rel="stylesheet">
                <style>
                    /* ── Base layout ──────────────────────────────────────────── */
                    *, *::before, *::after { box-sizing: border-box; }
                    body {
                        background: #0d0b1a;
                        margin: 0;
                        padding: 0;
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-family: 'Inter', Arial, sans-serif;
                        min-height: 100vh;
                    }

                    /* ── Sticky header bar (hidden on print) ─────────────────── */
                    .print-header {
                        background: #100d23;
                        border-bottom: 1px solid rgba(156,206,195,.15);
                        padding: 14px 24px;
                        width: 100%;
                        position: sticky;
                        top: 0;
                        z-index: 1000;
                        box-shadow: 0 4px 20px rgba(0,0,0,.3);
                    }
                    .print-header-content {
                        max-width: 1200px;
                        margin: 0 auto;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;
                    }
                    .print-title {
                        color: #fff;
                        font-family: 'Outfit', sans-serif;
                        font-size: 16px;
                        font-weight: 600;
                    }
                    .btn-print {
                        background: linear-gradient(135deg,#9ccec3 0%,#7dbba9 100%);
                        border: 1px solid rgba(255,255,255,.15);
                        color: #0a100f;
                        padding: 10px 20px;
                        border-radius: 8px;
                        font-weight: 700;
                        font-family: 'Outfit', sans-serif;
                        font-size: 14px;
                        display: flex;
                        align-items: center;
                        gap: 8px;
                        cursor: pointer;
                        transition: all .2s ease;
                        box-shadow: 0 4px 15px rgba(156,206,195,.25);
                    }
                    .btn-print:hover {
                        transform: translateY(-1px);
                        box-shadow: 0 6px 20px rgba(156,206,195,.4);
                        filter: brightness(1.05);
                    }

                    /* ── A4 wrapper (screen preview) ─────────────────────────── */
                    .a4-page-wrapper {
                        width: 210mm;
                        min-height: 297mm;
                        padding: 20mm;
                        background: #ffffff;
                        color: #1f2937;
                        font-family: Arial, sans-serif;
                        font-size: 12px;
                        line-height: 1.5;
                        box-shadow: 0 10px 30px rgba(0,0,0,.5);
                        border: 1px solid rgba(255,255,255,.05);
                        margin: 40px auto;
                    }
                    .document-content {
                        display: flex;
                        flex-direction: column;
                        min-height: calc(297mm - 40mm);
                    }

                    /* ── Document component styles (fully inlined) ───────────── */
                    :root { --secondary: #2563eb; }
                    .doc-header-top { display:flex; justify-content:space-between; align-items:center; }
                    .doc-logo-area  { display:flex; align-items:center; gap:8px; }
                    .doc-logo       { max-height:40px; width:auto; }
                    .doc-logo-title { font-size:16px; font-weight:700; }
                    .doc-meta-badge { background:#f3f4f6; color:#4b5563; padding:4px 8px; border-radius:4px; font-size:10px; font-weight:700; letter-spacing:.5px; }
                    .doc-header-divider { height:2px; background:#e5e7eb; margin:12px 0; }

                    .doc-metadata-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:12px; margin-bottom:20px; }
                    .doc-meta-item { display:flex; flex-direction:column; }
                    .doc-meta-item .lbl { font-size:9px; color:#6b7280; font-weight:700; margin-bottom:2px; }
                    .doc-meta-item .val { font-size:11px; color:#1f2937; font-weight:600; }

                    .doc-section-title { background:#f8fafc; border-left:3px solid #2563eb; color:#2563eb; padding:6px 10px; font-size:11px; font-weight:700; margin-top:16px; margin-bottom:12px; text-transform:uppercase; }

                    .doc-kpis    { display:grid; grid-template-columns:repeat(5,1fr); gap:10px; margin-bottom:16px; }
                    .doc-kpi-box { background:#f9fafb; border:1px solid #e5e7eb; border-radius:6px; padding:10px; text-align:center; display:flex; flex-direction:column; justify-content:center; }
                    .doc-kpi-val { font-size:20px; font-weight:700; color:#111827; }
                    .doc-kpi-lbl { font-size:9px; color:#6b7280; font-weight:500; margin-top:2px; }

                    .doc-feedback-card   { border:1px solid #e5e7eb; border-radius:8px; padding:16px; margin-bottom:16px; display:flex; align-items:center; gap:20px; background:#ffffff; }
                    .doc-score-container { display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; min-width:120px; }
                    .doc-score-ring      { width:80px; height:80px; border-radius:50%; border:4px solid #e5e7eb; display:flex; flex-direction:column; align-items:center; justify-content:center; background:#0d0b1a; color:#ffffff; box-shadow:0 0 10px rgba(0,0,0,0.15); }
                    .doc-score-number    { font-family:'Outfit', sans-serif; font-size:28px; font-weight:800; line-height:1; color:#ffffff; }
                    .doc-score-lbl-pts   { font-size:8px; text-transform:uppercase; color:#9ca3af; font-weight:600; }
                    .doc-feedback-badge  { padding:4px 10px; border-radius:20px; font-size:9px; font-weight:700; text-transform:uppercase; text-align:center; white-space:nowrap; border:1px solid transparent; }
                    .doc-band-red        { border-left:4px solid #ef4444; }
                    .doc-band-red .doc-score-ring { border-color:#ef4444; box-shadow:0 0 10px rgba(239,68,68,0.3); }
                    .doc-band-red .doc-feedback-badge { background:#fee2e2; color:#b91c1c; border-color:rgba(239,68,68,0.3); }
                    .doc-band-orange     { border-left:4px solid #f59e0b; }
                    .doc-band-orange .doc-score-ring { border-color:#f59e0b; box-shadow:0 0 10px rgba(245,158,11,0.3); }
                    .doc-band-orange .doc-feedback-badge { background:#fef3c7; color:#b45309; border-color:rgba(245,158,11,0.3); }
                    .doc-band-yellow     { border-left:4px solid #eab308; }
                    .doc-band-yellow .doc-score-ring { border-color:#eab308; box-shadow:0 0 10px rgba(234,179,8,0.3); }
                    .doc-band-yellow .doc-feedback-badge { background:#fef9c3; color:#854d0e; border-color:rgba(234,179,8,0.3); }
                    .doc-band-green      { border-left:4px solid #10b981; }
                    .doc-band-green .doc-score-ring { border-color:#10b981; box-shadow:0 0 10px rgba(16,185,129,0.3); }
                    .doc-band-green .doc-feedback-badge { background:#d1fae5; color:#047857; border-color:rgba(16,185,129,0.3); }
                    .doc-feedback-body         { display:flex; flex-direction:column; gap:6px; flex:1; }
                    .doc-feedback-body .doc-desc { font-size:11px; color:#374151; }
                    .doc-recs-box              { font-size:10px; color:#4b5563; border-top:1px solid #f3f4f6; padding-top:6px; }
                    .doc-recs-box strong       { color:#1f2937; }

                    .doc-table    { width:100% !important; border-collapse:collapse !important; font-size:10px !important; margin-bottom:16px !important; background:#ffffff !important; color:#1f2937 !important; }
                    .doc-table tr { background:#ffffff !important; }
                    .doc-table th { background:#f3f4f6 !important; color:#374151 !important; font-weight:700 !important; padding:6px 10px !important; border-bottom:2px solid #d1d5db !important; text-align:left !important; }
                    .doc-table td { padding:6px 10px !important; border-bottom:1px solid #e5e7eb !important; color:#4b5563 !important; background:#ffffff !important; }

                    .doc-breakdown-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; margin-bottom:24px; }
                    .doc-breakdown-col  { border:1px solid #e5e7eb; border-radius:6px; padding:10px; min-height:120px; background:#ffffff; }
                    .doc-breakdown-col .col-hdr { font-size:10px; font-weight:700; border-bottom:1px solid #f3f4f6; padding-bottom:4px; margin-bottom:8px; text-transform:uppercase; }

                    .doc-list        { list-style:none; padding:0; margin:0; font-size:9.5px; display:flex; flex-direction:column; gap:6px; }
                    .doc-list li     { padding-left:8px; position:relative; color:#4b5563; }
                    .doc-list li::before           { content:"•"; position:absolute; left:0; font-weight:bold; }
                    .doc-list.text-success li::before { color:#10b981; }
                    .doc-list.text-danger  li::before { color:#ef4444; }

                    .doc-footer { margin-top:auto; padding-top:12px; border-top:1px solid #e5e7eb; display:flex; justify-content:space-between; font-size:9px; color:#9ca3af; }

                    /* ── Page-break marker (screen) ──────────────────────────── */
                    .pdf-page-break-marker {
                        display: flex;
                        align-items: center;
                        gap: 10px;
                        margin: 16px 0;
                        border-top: 2px dashed #9ccec3;
                        padding-top: 4px;
                        font-size: 10px;
                        color: #9ccec3;
                        user-select: none;
                    }

                    /* ── Print overrides ─────────────────────────────────────── */
                    @media print {
                        body {
                            background: #ffffff !important;
                            padding: 0 !important;
                            margin: 0 !important;
                        }
                        .no-print { display: none !important; }
                        .a4-page-wrapper {
                            box-shadow: none !important;
                            border: none !important;
                            width: 100% !important;
                            margin: 0 !important;
                            padding: 20mm !important;
                        }
                        .pdf-page-break-marker {
                            border: none !important;
                            background: none !important;
                            margin: 0 !important;
                            padding: 0 !important;
                            height: 0 !important;
                            overflow: hidden !important;
                            font-size: 0 !important;
                            page-break-before: always !important;
                            break-before: page !important;
                        }
                        .pdf-page-break-marker * { display: none !important; }
                        .doc-section-container,
                        .doc-breakdown-col,
                        .doc-feedback-card,
                        .doc-kpis,
                        tr {
                            page-break-inside: avoid !important;
                            break-inside: avoid !important;
                        }
                        @page { size: A4 portrait; margin: 0; }
                    }
                </style>
            </head>
            <body>
                <div class="print-header no-print">
                    <div class="print-header-content">
                        <span class="print-title">Visualização de Impressão — ${filename}</span>
                        <button class="btn-print" onclick="window.print()">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
                            Fazer download do PDF
                        </button>
                    </div>
                </div>
                <div class="a4-page-wrapper">
                    <div class="document-content">
                        ${contentHtml}
                    </div>
                </div>
            </body>
            </html>
        `);
        printWindow.document.close();
    }

    // Botão principal de download (dashboard)
    btnDownloadPDF.addEventListener('click', () => {
        populateModalA4();
        saveToHistory(parsedData);
        generatePdfPrint(pdfTemplateTarget);
    });

    // Botão do modal — gera preview de impressão e fecha o modal
    btnModalDownload.addEventListener('click', () => {
        saveToHistory(parsedData);
        generatePdfPrint(pdfTemplateTarget);
        previewModal.classList.remove('open');
    });

    // ==========================================================================
    // 📚 Sistema de Histórico (localStorage — expira em 5 dias)
    // ==========================================================================
    const HISTORY_KEY = 'reportHistory';
    const HISTORY_EXPIRY_DAYS = 5;
    function saveToHistory(data) {
        const now = new Date();
        const dd = String(now.getDate()).padStart(2, '0');
        const mm = String(now.getMonth() + 1).padStart(2, '0');
        const yyyy = now.getFullYear();
        const hh = String(now.getHours()).padStart(2, '0');
        const min = String(now.getMinutes()).padStart(2, '0');
        const sec = String(now.getSeconds()).padStart(2, '0');
        const safeName = (data.testerName || 'Testador')
            .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
            .replace(/[^a-zA-Z0-9 ]/g, '').trim().replace(/\s+/g, '_');
        const fileName = `Relatorio_${safeName}_${dd}-${mm}-${yyyy}_${hh}h${min}m${sec}s`;

        const entry = {
            id: `hist_${now.getTime()}`,
            savedAt: now.toISOString(),
            fileName: fileName,
            testerName: data.testerName,
            startDate: data.startDate,
            endDate: data.endDate,
            approved: data.kpis.approved,
            reproved: data.kpis.reproved,
            total: data.kpis.total,
            score: data.score,
            parsedData: data
        };

        let history = loadHistory();
        // Remove duplicate entry with the exact same raw text content to avoid spamming the same report
        history = history.filter(h => !h.parsedData || h.parsedData.rawText !== data.rawText);
        history.unshift(entry);
        // Mantém apenas os últimos 5
        if (history.length > 5) history = history.slice(0, 5);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function loadHistory() {
        try {
            const all = JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
            const now = Date.now();
            const expiryMs = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
            // Filtra entradas expiradas (mais de 5 dias)
            const valid = all.filter(h => {
                const age = now - new Date(h.savedAt).getTime();
                return age < expiryMs;
            });
            // Se algum expirou, salva a lista limpa
            if (valid.length !== all.length) {
                localStorage.setItem(HISTORY_KEY, JSON.stringify(valid));
            }
            return valid;
        } catch (e) {
            return [];
        }
    }

    function deleteHistoryEntry(id) {
        let history = loadHistory();
        history = history.filter(h => h.id !== id);
        localStorage.setItem(HISTORY_KEY, JSON.stringify(history));
    }

    function formatHistoryDate(isoString) {
        try {
            const d = new Date(isoString);
            const dd = String(d.getDate()).padStart(2, '0');
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const yyyy = d.getFullYear();
            const hh = String(d.getHours()).padStart(2, '0');
            const min = String(d.getMinutes()).padStart(2, '0');
            return `${dd}/${mm}/${yyyy} ${hh}:${min}`;
        } catch (e) { return '--'; }
    }

    function daysUntilExpiry(isoString) {
        const age = Date.now() - new Date(isoString).getTime();
        const expiryMs = HISTORY_EXPIRY_DAYS * 24 * 60 * 60 * 1000;
        const remaining = Math.ceil((expiryMs - age) / (24 * 60 * 60 * 1000));
        return remaining;
    }

    function rebuildRawTextFromTasks(tasks, extraTasksList) {
        if (!tasks || tasks.length === 0) return "";
        let text = "";
        tasks.forEach((t, index) => {
            const num = String(index + 1).padStart(2, '0');
            text += `📌 CARD ${num}\n\n`;
            text += `Nome do card: ${t.task}\n`;
            text += `ID do card: ${t.id}\n`;
            text += `Servidor: ${t.server || 'Não informado'}\n`;
            text += `Status: ${t.status === 'Aprovado' ? 'APROVADO' : 'NEGADO'}\n`;
            text += `Observação teste: ${t.note || ''}\n\n`;
        });
        
        const approvedCount = tasks.filter(t => t.status === 'Aprovado').length;
        const reprovedCount = tasks.filter(t => t.status === 'Reprovado').length;
        
        text += `📊 RESULTADOS DO DIA\n`;
        text += `Aprovados: ${approvedCount}\n`;
        text += `Reprovados: ${reprovedCount}\n`;
        text += `Total Testados: ${tasks.length}\n\n`;
        
        if (extraTasksList && extraTasksList.length > 0) {
            text += `🧪 TAREFAS EXTRAS TESTADAS\n`;
            extraTasksList.forEach(et => {
                text += `- ${et}\n`;
            });
        }
        return text.trim();
    }

    function renderHistoryModal() {
        const history = loadHistory();
        historyTableBody.innerHTML = '';

        if (history.length === 0) {
            historyEmptyState.style.display = 'flex';
            historyTable.style.display = 'none';
            historyCount.textContent = '';
            return;
        }

        historyEmptyState.style.display = 'none';
        historyTable.style.display = 'table';
        historyCount.textContent = `${history.length} relatório${history.length !== 1 ? 's' : ''} salvo${history.length !== 1 ? 's' : ''} · expira em até ${HISTORY_EXPIRY_DAYS} dias`;

        history.forEach(entry => {
            const daysLeft = daysUntilExpiry(entry.savedAt);
            const expiryClass = daysLeft <= 1 ? 'expiry-urgent' : daysLeft <= 2 ? 'expiry-warn' : '';

            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>
                    <div class="hist-filename">
                        <i data-lucide="file-text" class="hist-file-icon"></i>
                        <span title="${entry.fileName}">${entry.fileName}</span>
                    </div>
                </td>
                <td class="hist-date">
                    <div>${formatHistoryDate(entry.savedAt)}</div>
                    <span class="hist-expiry ${expiryClass}">Expira em ${daysLeft}d</span>
                </td>
                <td>
                    <div class="hist-status-pills">
                        <span class="hist-pill hist-approved">✓ ${entry.approved}</span>
                        <span class="hist-pill hist-reproved">✗ ${entry.reproved}</span>
                    </div>
                </td>
                <td class="hist-total">${entry.total}</td>
                <td><span class="hist-score">${entry.score} pts</span></td>
                <td>
                    <div class="hist-actions">
                        <button class="btn-hist-download" data-id="${entry.id}" title="Baixar PDF">
                            <i data-lucide="download" class="icon-xs"></i> Baixar
                        </button>
                        <button class="btn-hist-restore" data-id="${entry.id}" title="Restaurar Relatório">
                            <i data-lucide="rotate-ccw" class="icon-xs"></i> Restaurar
                        </button>
                        <button class="btn-hist-delete" data-id="${entry.id}" title="Excluir entrada">
                            <i data-lucide="trash-2" class="icon-xs"></i>
                        </button>
                    </div>
                </td>
            `;
            historyTableBody.appendChild(tr);
        });

        if (window.lucide) window.lucide.createIcons({ root: historyTableBody });

        // Bind download buttons
        historyTableBody.querySelectorAll('.btn-hist-download').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const entry = loadHistory().find(h => h.id === id);
                if (entry && entry.parsedData) {
                    parsedData = entry.parsedData;
                    renderDashboard();
                    populateModalA4();
                    generatePdfPrint(pdfTemplateTarget);
                    showToast(`Gerando PDF: ${entry.fileName}`, 'info');
                }
            });
        });

        // Bind restore buttons
        historyTableBody.querySelectorAll('.btn-hist-restore').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                const entry = loadHistory().find(h => h.id === id);
                if (entry && entry.parsedData) {
                    if (entry.parsedData.rawText !== undefined) {
                        rawInput.value = entry.parsedData.rawText;
                    } else if (entry.parsedData.tasks) {
                        // Rebuild text from tasks as fallback
                        rawInput.value = rebuildRawTextFromTasks(entry.parsedData.tasks, entry.parsedData.extraTasksList);
                    }
                    
                    charCount.textContent = `${rawInput.value.length} caracteres`;

                    if (entry.parsedData.testerName) {
                        testerNameInput.value = entry.parsedData.testerName;
                        localStorage.setItem('testerName', entry.parsedData.testerName);
                    }
                    if (entry.parsedData.extraTasks !== undefined) {
                        extraTasksInput.value = entry.parsedData.extraTasks;
                    }
                    if (entry.parsedData.startDate) {
                        startDateInput.value = entry.parsedData.startDate;
                    }
                    if (entry.parsedData.endDate !== undefined) {
                        endDateInput.value = entry.parsedData.endDate;
                    }

                    // Process restored report to update dashboard
                    btnProcess.click();

                    // Close history modal
                    historyModal.classList.remove('open');

                    // Show success toast
                    showToast('Relatório restaurado com sucesso!', 'success');
                }
            });
        });

        // Bind delete buttons
        historyTableBody.querySelectorAll('.btn-hist-delete').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.getAttribute('data-id');
                deleteHistoryEntry(id);
                renderHistoryModal();
                showToast('Entrada removida do histórico.', 'info');
            });
        });
    }

    // History Modal event listeners
    btnHistory.addEventListener('click', () => {
        renderHistoryModal();
        historyModal.classList.add('open');
    });

    btnCloseHistory.addEventListener('click', () => {
        historyModal.classList.remove('open');
    });

    historyModal.addEventListener('click', (e) => {
        if (e.target === historyModal) historyModal.classList.remove('open');
    });

    // Custom confirm modal logic
    btnClearHistory.addEventListener('click', () => {
        clearConfirmModal.classList.add('open');
    });

    const closeConfirmModal = () => {
        clearConfirmModal.classList.remove('open');
    };

    btnCancelClear.addEventListener('click', closeConfirmModal);
    btnCancelClearClose.addEventListener('click', closeConfirmModal);
    clearConfirmModal.addEventListener('click', (e) => {
        if (e.target === clearConfirmModal) closeConfirmModal();
    });

    btnConfirmClear.addEventListener('click', () => {
        localStorage.removeItem(HISTORY_KEY);
        renderHistoryModal();
        closeConfirmModal();
        showToast('Histórico limpo com sucesso.', 'info');
    });
});
