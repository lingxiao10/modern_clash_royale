/**
 * MobileLogger - 手机调试日志收集器
 * 在游戏中显示悬浮日志收集按钮，提供日志记录和复制功能
 */
class MobileLogger {

    //只有在这里的才会被打印
    shownTagsNow=[];
    static getUrlParams(paramName) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(paramName);
    }
    constructor(options = {}) {
        this.enabled = this.constructor.getUrlParams("debug");
        this.maxEntriesPerTag = options.maxEntriesPerTag || 10;
        this.logs = {}; // { tag: [logEntry1, logEntry2, ...] }
        this.showCounter = options.showCounter !== false;
        this.floatingButton = null;
        this.logCounter = 0;
        this.shownTagsNow = options.shownTagsNow || [];

        if (this.enabled) {
            this.initSelf();
        }
    }

    initSelf() {
        this.createFloatingButton();
        this.injectStyles();
    }

    injectStyles() {
        if (document.getElementById('mobile-logger-styles')) return;

        const style = document.createElement('style');
        style.id = 'mobile-logger-styles';
        style.textContent = `
            .mobile-logger-float {
                position: fixed;
                top: 10px;
                left: 10px;
                z-index: 99999;
                display: flex;
                align-items: center;
                gap: 8px;
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 8px 12px;
                border-radius: 20px;
                font-size: 12px;
                font-family: 'Arial', sans-serif;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                border: 1px solid rgba(255, 255, 255, 0.2);
                touch-action: none;
                user-select: none;
                -webkit-user-select: none;
            }

            .mobile-logger-counter {
                display: flex;
                align-items: center;
                background: #2196F3;
                padding: 2px 8px;
                border-radius: 10px;
                font-weight: bold;
            }

            .mobile-logger-copy-btn {
                background: #4CAF50;
                color: white;
                border: none;
                padding: 4px 8px;
                border-radius: 6px;
                font-size: 11px;
                font-weight: bold;
                cursor: pointer;
                transition: background 0.3s;
                touch-action: manipulation;
            }

            .mobile-logger-copy-btn:hover,
            .mobile-logger-copy-btn:active {
                background: #45a049;
            }

            .mobile-logger-float.dragging {
                opacity: 0.8;
                transform: scale(1.05);
            }
        `;
        document.head.appendChild(style);
    }

    createFloatingButton() {
        this.floatingButton = document.createElement('div');
        this.floatingButton.className = 'mobile-logger-float';
        this.floatingButton.innerHTML = `
            <div class="mobile-logger-counter">
                📝 <span id="log-counter">${this.logCounter}</span>
            </div>
            <button class="mobile-logger-copy-btn" id="copy-logs-btn">Copy</button>
        `;

        document.body.appendChild(this.floatingButton);

        // 添加拖拽功能
        this.addDragFunctionality();

        // 添加复制功能
        this.setupCopyButton();

        // 添加触摸设备优化
        this.optimizeForTouchDevices();
    }

    addDragFunctionality() {
        let startX, startY, currentX, currentY, isDragging = false;
        const sensitivity = 10; // 最小拖拽距离，避免误触

        const startDrag = (e) => {
            e.preventDefault();
            isDragging = false;
            startX = e.touches ? e.touches[0].clientX : e.clientX;
            startY = e.touches ? e.touches[0].clientY : e.clientY;
            currentX = parseFloat(this.floatingButton.style.left) || this.floatingButton.offsetLeft;
            currentY = parseFloat(this.floatingButton.style.top) || this.floatingButton.offsetTop;

            document.addEventListener(e.touches ? 'touchmove' : 'mousemove', drag);
            document.addEventListener(e.touches ? 'touchend' : 'mouseup', endDrag);
            this.floatingButton.classList.add('dragging');
        };

        const drag = (e) => {
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;

            const deltaX = clientX - startX;
            const deltaY = clientY - startY;

            if (Math.abs(deltaX) > sensitivity || Math.abs(deltaY) > sensitivity) {
                isDragging = true;
            }

            if (isDragging) {
                const newX = currentX + deltaX;
                const newY = currentY + deltaY;

                // 边界检查
                const maxX = window.innerWidth - this.floatingButton.offsetWidth;
                const maxY = window.innerHeight - this.floatingButton.offsetHeight;

                this.floatingButton.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
                this.floatingButton.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
            }
        };

        const endDrag = () => {
            document.removeEventListener('touchmove', drag);
            document.removeEventListener('mousemove', drag);
            document.removeEventListener('touchend', endDrag);
            document.removeEventListener('mouseup', endDrag);
            this.floatingButton.classList.remove('dragging');

            if (!isDragging) {
                // 如果没有实际拖拽，则可能是点击
                this.toggleLogPanel();
            }
        };

        this.floatingButton.addEventListener('touchstart', startDrag, { passive: false });
        this.floatingButton.addEventListener('mousedown', startDrag);
    }

    setupCopyButton() {
        const copyBtn = this.floatingButton.querySelector('#copy-logs-btn');

        copyBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // 阻止冒泡到拖拽事件
            e.preventDefault(); // 防止默认行为
            this.copyLogsToClipboard();
            return false; // 防止进一步冒泡
        });
    }

    optimizeForTouchDevices() {
        // 在触摸设备上增加触摸区域
        if ('ontouchstart' in window) {
            const buttons = this.floatingButton.querySelectorAll('.mobile-logger-copy-btn');
            buttons.forEach(btn => {
                btn.style.minWidth = '44px';
                btn.style.minHeight = '32px';
            });
        }
    }

    /**
     * 添加日志条目
     * @param {string|object} content - 日志内容
     * @param {string} tag - 日志标记，用于分组和限制条目数
     * @param {number} maxEntries - 该标记下的最大记录数量，默认10
     */
    logNow(content, tag = 'default', maxEntries = this.maxEntriesPerTag) {
        if (!this.enabled) return;

        // 检查是否允许显示此tag的日志
        if (!this.shownTagsNow.includes(tag)) {
            return;
        }

        // 初始化标记日志数组
        if (!this.logs[tag]) {
            this.logs[tag] = [];
        }

        // 序列化内容
        let serializedContent = content;
        if (typeof content === 'object') {
            try {
                serializedContent = JSON.stringify(content, null, 2);
            } catch (e) {
                serializedContent = String(content);
            }
        }

        // 创建日志条目
        const entry = {
            timestamp: new Date().toISOString(),
            content: serializedContent,
            tag: tag
        };


        // 添加到对应标记的日志数组


        // 保持最大条目数
        if (this.logs[tag].length >= maxEntries) {
            return;
            // this.logs[tag] = this.logs[tag].slice(-maxEntries);
        }
        this.logs[tag].push(entry);
        console.log(content,"MobileLogger_entry="+tag);

        // 更新计数器显示
        this.updateLogCounter();
    }

    updateLogCounter() {
        this.logCounter = Object.values(this.logs).reduce((total, entries) => total + entries.length, 0);

        if (this.showCounter && this.floatingButton) {
            const counterElement = this.floatingButton.querySelector('#log-counter');
            if (counterElement) {
                counterElement.textContent = this.logCounter;
            }
        }
    }

    /**
     * 将所有日志复制到剪贴板
     */
    copyLogsToClipboard() {
        try {
            let allLogsText = '';

            // 收集所有日志
            Object.keys(this.logs).forEach(tag => {
                if (this.logs[tag].length === 0) return;

                allLogsText += `\n=== ${tag.toUpperCase()} LOGS (${this.logs[tag].length} entries) ===\n`;

                this.logs[tag].forEach((entry, index) => {
                    allLogsText += `[${index + 1}] ${entry.timestamp}\n${entry.content}\n\n`;
                });
            });

            // 如果没有日志
            if (!allLogsText.trim()) {
                allLogsText = 'No logs collected yet.';
            }

            // 使用 Helper.copy 方法复制
            Helper.copy(allLogsText);

        } catch (error) {
            console.error('复制日志时发生错误:', error);
            this.showToast('复制失败，请检查控制台');
        }
    }

    /**
     * 复制到剪贴板（使用clipboard.js插件）
     */
    copyClipboardJS(text) {
        try {
            if (typeof ClipboardJS !== 'undefined') {
                // 使用clipboard.js创建一个临时按钮
                const tempBtn = document.createElement('button');
                tempBtn.setAttribute('data-clipboard-text', text);
                document.body.appendChild(tempBtn);

                const clipboard = new ClipboardJS(tempBtn);

                clipboard.on('success', () => {
                    this.showToast('日志已复制到剪贴板');
                    clipboard.destroy();
                    document.body.removeChild(tempBtn);
                });

                clipboard.on('error', (e) => {
                    console.error('clipboard.js复制失败:', e);
                    this.fallbackCopy(text);
                    clipboard.destroy();
                    document.body.removeChild(tempBtn);
                });

                // 触发复制
                tempBtn.click();

            } else {
                throw new Error('clipboard.js not loaded');
            }

        } catch (error) {
            console.error('clipboard.js复制出错:', error);
            this.fallbackCopy(text);
        }
    }

    /**
     * 降级复制方法（兼容老旧浏览器）
     */
    fallbackCopy(text) {
        try {
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-9999px';
            textArea.style.top = '-9999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            textArea.setSelectionRange(0, 99999); // For mobile devices

            if (document.execCommand('copy')) {
                this.showToast('日志已复制到剪贴板');
            } else {
                throw new Error('execCommand failed');
            }

            document.body.removeChild(textArea);
        } catch (fallbackError) {
            console.error('降级复制也失败:', fallbackError);
            // 作为最后的手段，在控制台输出
            console.log('Mobile Logger Logs:', text);
            this.showToast('复制失败，已在控制台输出');
        }
    }

    /**
     * 显示提示消息
     */
    showToast(message, duration = 3000) {
        if (typeof ui !== 'undefined' && ui.showToast) {
            ui.showToast(message);
        } else {
            // 降级到原生提示
            const toast = document.createElement('div');
            toast.textContent = message;
            toast.style.cssText = `
                position: fixed;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                background: rgba(0, 0, 0, 0.8);
                color: white;
                padding: 12px 20px;
                border-radius: 8px;
                z-index: 100000;
                font-family: Arial, sans-serif;
                font-size: 14px;
                pointer-events: none;
            `;
            document.body.appendChild(toast);
            setTimeout(() => document.body.removeChild(toast), duration);
        }
    }

    /**
     * 切换日志面板的开关状态
     */
    toggleLogPanel() {
        // 直接复制日志，不显示额外的面板
        this.copyLogsToClipboard();
    }

    /**
     * 清空所有日志
     */
    clearLogs() {
        this.logs = {};
        this.logCounter = 0;
        this.updateLogCounter();
    }

    /**
     * 获取指定标记的日志
     */
    getLogsByTag(tag) {
        return this.logs[tag] || [];
    }

    /**
     * 获取所有日志
     */
    getAllLogs() {
        const allLogs = {};
        Object.keys(this.logs).forEach(tag => {
            allLogs[tag] = [...this.logs[tag]];
        });
        return allLogs;
    }

    /**
     * 销毁 logger
     */
    destroy() {
        if (this.floatingButton && this.floatingButton.parentNode) {
            this.floatingButton.parentNode.removeChild(this.floatingButton);
        }
        this.logs = {};
        this.logCounter = 0;
        this.enabled = false;
    }
    static log(content, tag = 'static', maxEntries = 10) {
        if (window.mobileLogger && window.mobileLogger.enabled) {
            window.mobileLogger.logNow(content, tag, maxEntries);
        }
    }
    static init(options = {}) {
        if (!window.mobileLogger) {
            window.mobileLogger = new MobileLogger(options);
        }
        return window.mobileLogger;
    }
}
