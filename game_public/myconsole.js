(function() {
    let originalConsoleMethods = {
        log: console.log,
        error: console.error,
        warn: console.warn,
        info: console.info
    };
    let state = {
        mode: 'collapsed', // collapsed, medium, fullscreen
        logs: [],
        clipboard: null
    };

    

    function createUI() {
        if (state.container) return;
        state.container = document.createElement('div');
        state.container.id = 'my-console';
        updateStyle();
        if (state.mode === 'collapsed') {
            state.container.innerHTML = '<span id="ball-icon" style="font-size:16px; cursor:pointer;">▼</span>';
            state.container.querySelector('#ball-icon').onclick = toggleMode;
        } else {
            let headerDiv = document.createElement('div');
            headerDiv.id = 'console-header';
            headerDiv.style.cssText = 'display:flex;flex-direction:column;padding:5px;';
            let titleRow = document.createElement('div');
            titleRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';
            let titleSpan = document.createElement('span');
            titleSpan.textContent = 'Console';
            titleSpan.style.cssText = 'display:inline-block;margin:6px 0;color:white;background:black;padding:2px 5px;';
            titleRow.appendChild(titleSpan);
            let btnGroup = document.createElement('div');
            btnGroup.style.cssText = 'display:flex;';
            let screenBtn = document.createElement('div');
            screenBtn.id = 'toggle-screen';
            screenBtn.textContent = '⛶';
            screenBtn.style.cssText = 'display:inline-block;margin:6px;background:#111;border:1px solid #0f0;color:#0f0;width:24px;height:24px;padding:0;border-radius:3px;margin-right:15px;display:flex;justify-content:center;align-items:center;cursor:pointer;';
            let collapsedBtn = document.createElement('div');
            collapsedBtn.id = 'toggle-collapsed';
            collapsedBtn.textContent = '▼';
            collapsedBtn.style.cssText = 'display:inline-block;margin:6px;background:#111;border:1px solid #0f0;color:#0f0;width:24px;height:24px;padding:0;border-radius:3px;display:flex;justify-content:center;align-items:center;cursor:pointer;';
            btnGroup.appendChild(screenBtn);
            btnGroup.appendChild(collapsedBtn);
            titleRow.appendChild(btnGroup);
            headerDiv.appendChild(titleRow);
            let searchRow = document.createElement('div');
            searchRow.style.cssText = 'display:flex;flex-direction:row;margin-bottom:6px;';
            let searchInput = document.createElement('input');
            searchInput.id = 'search-input';
            searchInput.placeholder = 'Search logs...';
            searchInput.style.cssText = 'display:inline-block;margin:6px;background:black;color:white;border:1px solid #0f0;padding:2px;width:calc(100% - 10px);height:40px;';
            searchInput.oninput = renderLogs;
            searchRow.appendChild(searchInput);
            headerDiv.appendChild(searchRow);
            let contentDiv = document.createElement('div');
            contentDiv.id = 'console-content';
            state.container.appendChild(headerDiv);
            state.container.appendChild(contentDiv);
            screenBtn.onclick = toggleScreen;
            collapsedBtn.onclick = toggleCollapsed;
        }
        document.body.appendChild(state.container);
    }

    function setupClipboard() {
        if (!state.clipboard) {
            state.clipboard = new ClipboardJS('.copy-btn');
            state.clipboard.on('success', function(e) {
                e.trigger.textContent = '✅';
                e.trigger.style.color = '#0f0';
                originalConsoleMethods.log('Copied: ' + e.text);
                setTimeout(() => {
                    e.trigger.textContent = '📋';
                    e.trigger.style.color = '#0f0';
                }, 3200);
            });
            state.clipboard.on('error', function(e) {
                originalConsoleMethods.log('Copy failed');
                e.trigger.textContent = '❌';
                e.trigger.style.color = '#f00';
                setTimeout(() => {
                    e.trigger.textContent = '📋';
                    e.trigger.style.color = '#0f0';
                }, 2000);
            });
        }
    }

    function createUIWithClipboard() {
        createUI();
        setupClipboard();
    }

    function updateStyle() {
        let base = 'position:fixed;z-index:99999;color:#0f0;border:none;padding:0;overflow:hidden;font-family:monospace;';
        if (state.mode === 'collapsed') {
            base += 'top:10px;right:10px;width:30px;height:30px;border-radius:50%;background:#000;border:2px solid #0f0;display:flex;justify-content:center;align-items:center;box-shadow:0 0 10px #0f0,0 0 20px #0f0;';
        } else if (state.mode === 'medium') {
            base += 'top:10px;left:10px;width:calc(100vw - 20px);max-height:50vh;overflow-y:auto;padding:0;border-radius:5px;background:#000;border:1px solid #0f0;box-shadow:0 0 15px #0f0;font-family:monospace;';
        } else if (state.mode === 'fullscreen') {
            base += 'top:0;left:0;width:100%;height:100%;overflow-y:auto;padding:0;border-radius:0;background:#000;border:1px solid #0f0;font-family:monospace;';
        }
        base += 'transition:all 0.3s ease;';
        state.container.style.cssText = base;
    }

    function toggleMode() {
        state.mode = 'medium';
        updateStyle();
        state.container.innerHTML = '';
        let headerDiv = document.createElement('div');
        headerDiv.id = 'console-header';
        headerDiv.style.cssText = 'display:flex;flex-direction:column;padding:5px;';
        let titleRow = document.createElement('div');
        titleRow.style.cssText = 'display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;';
        let titleSpan = document.createElement('span');
        titleSpan.textContent = 'Console';
        titleSpan.style.cssText = 'display:inline-block;margin:6px 0;color:white;background:black;padding:2px 5px;';
        titleRow.appendChild(titleSpan);
        let btnGroup = document.createElement('div');
        btnGroup.style.cssText = 'display:flex;';
        let screenBtn = document.createElement('div');
        screenBtn.id = 'toggle-screen';
        screenBtn.textContent = '⛶';
        screenBtn.style.cssText = 'display:inline-block;margin:6px;background:#111;border:1px solid #0f0;color:#0f0;width:24px;height:24px;padding:0;border-radius:3px;margin-right:15px;display:flex;justify-content:center;align-items:center;cursor:pointer;';
        let collapsedBtn = document.createElement('div');
        collapsedBtn.id = 'toggle-collapsed';
        collapsedBtn.textContent = '▼';
        collapsedBtn.style.cssText = 'display:inline-block;margin:6px;background:#111;border:1px solid #0f0;color:#0f0;width:24px;height:24px;padding:0;border-radius:3px;display:flex;justify-content:center;align-items:center;cursor:pointer;';
        btnGroup.appendChild(screenBtn);
        btnGroup.appendChild(collapsedBtn);
        titleRow.appendChild(btnGroup);
        headerDiv.appendChild(titleRow);
        let searchRow = document.createElement('div');
        searchRow.style.cssText = 'display:flex;flex-direction:row;margin-bottom:6px;';
        let searchInput = document.createElement('input');
        searchInput.id = 'search-input';
        searchInput.placeholder = 'Search logs...';
        searchInput.style.cssText = 'display:inline-block;margin:6px;background:black;color:white;border:1px solid #0f0;padding:2px;width:calc(100% - 10px);height:40px;';
        searchInput.oninput = renderLogs;
        searchRow.appendChild(searchInput);
        headerDiv.appendChild(searchRow);
        let contentDiv = document.createElement('div');
        contentDiv.id = 'console-content';
        state.container.appendChild(headerDiv);
        state.container.appendChild(contentDiv);
        screenBtn.onclick = toggleScreen;
        collapsedBtn.onclick = toggleCollapsed;
        renderLogs();
    }

    function toggleScreen() {
        state.mode = state.mode === 'medium' ? 'fullscreen' : 'medium';
        updateStyle();
        renderLogs();
    }

    function toggleCollapsed() {
        state.mode = 'collapsed';
        updateStyle();
        state.container.innerHTML = '<span id="ball-icon" style="font-size:16px; cursor:pointer;">▼</span>';
        state.container.querySelector('#ball-icon').onclick = toggleMode;
    }

    function addLog(type, args) {
        let timestamp = new Date().toLocaleTimeString();
        let message = args.map(arg => {
            if (arg instanceof Error) {
                return arg.message;
            } else if (typeof arg === 'object') {
                return JSON.stringify(arg);
            } else {
                return arg;
            }
        }).join(' ');
        let stack = args.find(arg => arg instanceof Error)?.stack;
        state.logs.push({ type, message, timestamp, stack });
        if (state.logs.length > 100) state.logs.shift();
        renderLogs();
    }

    function renderLogs() {
        let content = document.getElementById('console-content');
        if (!content || state.mode === 'collapsed') return;
        content.innerHTML = '';
        let searchTerm = document.getElementById('search-input').value.toLowerCase();
        let filteredLogs = state.logs.filter(log => log.message.toLowerCase().includes(searchTerm));
        filteredLogs.forEach((log, i) => {
            let el = document.createElement('div');
            el.className = 'log-entry';
            el.style.cssText = `margin:5px 0;padding:2px;border-bottom:1px solid #0f0;color: ${
                log.type === 'error' ? '#f56565' : log.type === 'warn' ? '#fbbf24' : '#0f0'
            };user-select:text;display:flex;flex-direction:row;max-width:100%;align-items:flex-start;`;
            let textContainer = document.createElement('div');
            textContainer.style.cssText = 'flex-grow:1;max-width:calc(100% - 80px);margin-right:10px;';
            let headerStr = `${log.timestamp} [${log.type.toUpperCase()}] `;
            let message = log.expanded || log.message.length <= 100 ? log.message : log.message.substr(0,100) + '...';
            let messageDiv = document.createElement('div');
            messageDiv.textContent = headerStr + message;
            messageDiv.style.cssText = 'word-wrap: break-word; white-space: pre-wrap;';
            textContainer.appendChild(messageDiv);
            if (log.stack) {
                let stackEl = document.createElement('div');
                stackEl.style.cssText = 'font-size:12px;margin-top:5px;color:#060;word-wrap:break-word;';
                stackEl.textContent = log.stack;
                textContainer.appendChild(stackEl);
            }
            if (log.message.length > 100) {
                let seeMoreBtn = document.createElement('div');
                seeMoreBtn.textContent = log.expanded ? 'SEE LESS' : 'SEE MORE';
                seeMoreBtn.style.cssText = 'color:#0f0;cursor:pointer;padding:2px;display:inline-block;margin-top:5px;';
                seeMoreBtn.onclick = () => {
                    log.expanded = !log.expanded;
                    renderLogs();
                };
                textContainer.appendChild(seeMoreBtn);
            }
            el.appendChild(textContainer);
            let btn = document.createElement('div');
            btn.className = 'copy-btn';
            btn.dataset.clipboardText = log.message;
            btn.textContent = '📋';
            btn.style.cssText = 'color:#0f0;cursor:pointer;font-size:14px;flex-shrink:0;';
            el.appendChild(btn);
            content.appendChild(el);
        });
    }

    // Override console methods
    console.log = function() { addLog('log', Array.from(arguments)); originalConsoleMethods.log.apply(console, arguments); };
    console.error = function() { addLog('error', Array.from(arguments)); if (arguments[0] instanceof Error) arguments[0] = { ...arguments[0], stack: arguments[0].stack }; originalConsoleMethods.error.apply(console, arguments); };
    console.warn = function() { addLog('warn', Array.from(arguments)); originalConsoleMethods.warn.apply(console, arguments); };
    console.info = function() { addLog('info', Array.from(arguments)); originalConsoleMethods.info.apply(console, arguments); };

    // Global error catcher
    window.addEventListener('error', e => addLog('error', [e.message, { stack: e.error ? e.error.stack : e.stack }]));
    window.addEventListener('unhandledrejection', e => addLog('error', ['Uncaught Promise: ' + (e.reason || 'Unknown'), { stack: e.reason && e.reason.stack ? e.reason.stack : null }]));

    // Initialization must be manually called from outside
    window.startMyConsole = createUIWithClipboard;
})();