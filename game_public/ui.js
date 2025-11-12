if(typeof(t)=="undefined")
{
    t=function(key){
      return t_inner(key);
    };
}
if(typeof(config)=="undefined")
{
    config={};
}
class UI {
    constructor(options = {}) {
        this.language = options.language || 'zh';
        this.theme = options.theme || 'light';
        TransBasic.setLan(this.language);
        this.texts = {
            zh: {
                confirm: '确认',
                cancel: '取消',
                ok: '确定'
            },
            en: {
                confirm: 'Confirm',
                cancel: 'Cancel',
                ok: 'OK'
            }
        };
        this.applyTheme();
        this.initStyles();
    }

    setLanguage(lang) {
        this.language = lang;
    }

    setTheme(theme) {
        this.theme = theme;
        this.applyTheme();
    }

    applyTheme() {
        document.documentElement.className = this.theme;
    }

    initStyles() {
        if (document.getElementById('ui-styles')) return;
        const style = document.createElement('style');
        style.id = 'ui-styles';
        style.textContent = `
            * {
                box-sizing: border-box;
            }
            :root {
                --bg-color: #f0f0f0;
                --text-color: #333;
                --shadow-color: rgba(0,0,0,0.3);
                --border-color: #ddd;
                --toast-bg: rgba(0,0,0,0.8);
                --toast-text: #fff;
            }
            .dark {
                --bg-color: #333;
                --text-color: #f0f0f0;
                --shadow-color: rgba(255,255,255,0.1);
                --border-color: #555;
                --toast-bg: rgba(255,255,255,0.9);
                --toast-text: #333;
            }
            .ui-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.5);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: opacity 0.3s;
                opacity: 0;
                pointer-events: none;
            }
            #top_up
            {
                margin-left:6px;
            }
            .ui-modal.show {
                opacity: 1;
                pointer-events: auto;
            }
            .ui-modal-content {
                background: var(--bg-color);
                color: var(--text-color);
                padding: 20px;
                border-radius: 10px;
                box-shadow: 0 10px 30px var(--shadow-color);
                max-width: 90vw;
                max-height: 90vh;
                overflow-y: auto;
                position: relative;
            }
            .ui-confirm-panel .ui-modal-content {
                text-align: center;
            }
            .ui-confirm-panel img,
            .ui-confirm-panel .emoji {
                max-width: 100%;
                height: auto;
                margin: 10px 0;
                border-radius: 5px;
            }
            .ui-confirm-panel .emoji {
                font-size: 30px;
                display: block;
                text-align: center;
            }
            .ui-confirm-btns {
                display: flex;
                justify-content: space-around;
                margin-top: 30px;
                gap: 20px;
            }
            button.ui-btn {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background: var(--text-color);
                color: var(--bg-color);
                font-weight: bold;
                transition: background 0.3s;
            }
            button.ui-btn:hover {
                opacity: 0.8;
            }
            button.ui-btn.cancel {
                background: #ccc;
                color: #333;
            }
            .dark button.ui-btn.cancel {
                background: #555;
                color: #f0f0f0;
            }
            .ui-toast {
                position: fixed;
                bottom: calc(100vh / 3);
                left: 50%;
                transform: translateX(-50%);
                background: var(--toast-bg);
                color: var(--toast-text);
                padding: 15px 25px;
                border-radius: 25px;
                box-shadow: 0 5px 15px var(--shadow-color);
                z-index: 1001;
                opacity: 0;
                transition: opacity 0.3s;
                max-width: 90vw;
                text-align: center;
            }
            .ui-toast.show {
                opacity: 1;
            }
            .ui-options-panel .ui-modal-content {
                text-align: center;
                width: 100vw;
                max-width: 100vw;
                border-radius: 0;
                min-height: 60vh;
                position: absolute;
                bottom: 0;
                left: 0;
                transform: translateY(100%);
                transition: transform 0.3s;
                padding-bottom: 60px; /* 为悬浮actions留空间 */
            }
            .ui-options-panel.show .ui-modal-content {
                transform: translateY(0);
            }
            .ui-options-header {
                padding: 20px;
                background: var(--bg-color);
                border-bottom: 1px solid var(--border-color);
            }
            .ui-options-list {
                list-style: none;
                padding: 0;
                margin: 0;
                max-height: 400px;
                overflow-y: auto;
                padding-bottom: 80px;
            }
            .ui-option {
                display: flex;
                align-items: center;
                padding: 15px;
                border-bottom: 1px solid var(--border-color);
                cursor: pointer;
                transition: background 0.3s;
            }
            .ui-option:hover {
                background: rgba(0,0,0,0.1);
            }
            .dark .ui-option:hover {
                background: rgba(255,255,255,0.1);
            }
            .ui-option .item-icon {
                width: 40px;
                height: 40px;
                margin-right: 15px;
                border-radius: 5px;
                flex-shrink: 0;
            }
            .ui-option img.item-icon {
                object-fit: cover;
            }
            .ui-option .emoji.item-icon {
                font-size: 24px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ui-option .text {
                flex: 1;
            }
            .ui-option .desc {
                font-size: 0.8em;
                color: #888;
            }
            .dark .ui-option .desc {
                color: #aaa;
            }
            .ui-options-actions {
                padding: 10px;
                background: var(--bg-color);
                border-top: 1px solid var(--border-color);
                position: fixed;
                bottom: 34px;
                left: 0;
                width: 100vw;
                z-index: 1001;
                display: flex;
                justify-content: center;
            }
            .ui-options-actions button {
                margin: 0 5px;
            }
            .ui-waiting-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0,0,0,0.7);
                display: flex;
                justify-content: center;
                align-items: center;
                z-index: 1000;
                transition: opacity 0.3s;
                opacity: 0;
                pointer-events: none;
            }
            .ui-waiting-modal.show {
                opacity: 1;
                pointer-events: auto;
            }
            .ui-waiting-content {
                background: var(--bg-color);
                color: var(--text-color);
                padding: 30px;
                border-radius: 10px;
                box-shadow: 0 10px 30px var(--shadow-color);
                text-align: center;
                max-width: 300px;
                width: 80vw;
            }
            .ui-waiting-text {
                font-size: 18px;
                margin-bottom: 20px;
            }
            .ui-progress-bar {
                width: 100%;
                height: 8px;
                background: var(--border-color);
                border-radius: 4px;
                overflow: hidden;
                margin-bottom: 20px;
            }
            .ui-progress-fill {
                height: 100%;
                background: #007bff;
                border-radius: 4px;
                transition: width 0.1s;
            }
            .ui-waiting-cancel {
                padding: 10px 20px;
                border: none;
                border-radius: 5px;
                cursor: pointer;
                background: #ccc;
                color: #333;
                font-weight: bold;
                transition: background 0.3s;
            }
            .ui-waiting-cancel:hover {
                opacity: 0.8;
            }
            .dark .ui-waiting-cancel {
                background: #555;
                color: #f0f0f0;
            }
            .ui-item-list-panel .ui-modal-content {
                width: 100vw;
                max-width: 100vw;
                height: 100vh;
                max-height: 100vh;
                border-radius: 0;
                display: flex;
                flex-direction: column;
            }
            .ui-item-list-panel .ui-modal-content.stretch {
                width: 100vw;
                height: 100vh;
            }
            .ui-item-list-header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                padding: 15px 20px;
                background: var(--bg-color);
                border-bottom: 1px solid var(--border-color);
                flex-shrink: 0;
            }
            .ui-item-list-header h2 {
                margin: 0;
                font-size: 1.2em;
                color: var(--text-color);
            }
            .ui-subtitle {
                margin: 5px 0 0 0;
                font-size: 0.9em;
                color: #888;
                font-weight: normal;
            }
            .dark .ui-subtitle {
                color: #aaa;
            }
            .ui-search-container {
                flex: 1;
                margin: 0 15px;
                max-width: 200px;
                display:block;
            }
            .ui-search-container.hidden {
                display: none;
            }
            .ui-search-input {
                width: 100%;
                padding: 8px 12px;
                border: 1px solid var(--border-color);
                border-radius: 20px;
                background: var(--bg-color);
                color: var(--text-color);
                font-size: 14px;
            }
            .dark .ui-search-input {
                background: var(--bg-color);
                color: var(--text-color);
            }
            .ui-close-btn {
                background: none;
                border: none;
                font-size: 28px;
                line-height: 1;
                cursor: pointer;
                color: var(--text-color);
                opacity: 0.7;
                transition: opacity 0.3s;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .ui-close-btn:hover {
                opacity: 1;
            }
            .ui-item-list-container {
                flex: 1;
                overflow: hidden;
            }
            .ui-item-grid {
                padding: 10px 10px 100px 10px; /* 在底部添加额外填充，避免被固定按钮覆盖 */
                overflow-y: auto;
                height: 100%;
                display: block;
            }
            .item-card {
                background: var(--bg-color);
                border: 1px solid var(--border-color);
                border-radius: 12px;
                margin-bottom: 15px;
                overflow: hidden;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 2px 8px rgba(0,0,0,0.1);
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                padding: 7px 0;
                position: relative;
            }
            .dark .item-card {
                box-shadow: 0 2px 8px rgba(255,255,255,0.1);
            }
           
            .item-card-image-container {
                width: 80px;
                height: 80px;
                margin-left: 10px;
                margin-right:10px;
                display: flex;
                align-items: center;
                justify-content: center;
                overflow: hidden;
                flex-shrink: 0;
                border-radius: 6px;
            }
            .item-card-image {
                max-width: 100%;
                max-height: 100%;
                width: auto;
                height: auto;
                object-fit: contain;
                border-radius: 6px;
            }
            .item-card-emoji, .item-card-placeholder {
                font-size: 48px;
                opacity: 0.7;
            }
            .item-card-content {
                flex: 1;
                padding: 15px;
                display: flex;
                flex-direction: column;
                min-height: 0;
            }
            .item-card-title {
                margin: 0 0 8px 0;
                font-size: 1.1em;
                font-weight: bold;
                color: var(--text-color);
                flex-shrink: 0;
            }
            .item-card-description {
                margin: 0 0 15px 0;
                font-size: 0.9em;
                color: #666;
                line-height: 1.4;
                flex-shrink: 0;
                display: -webkit-box;
                -webkit-line-clamp: 3;
                -webkit-box-orient: vertical;
                overflow: hidden;
            }
            .dark .item-card-description {
                color: #aaa;
            }
            .item-card-spacer {
                flex: 1;
            }
            .item-card-actions {
                display: flex;
                gap: 8px;
                flex-wrap: wrap;
                margin-top: 0px;
                flex-shrink: 0;
            }
            .item-action-btn {
                padding: 8px 16px;
                border: 1px solid var(--border-color);
                border-radius: 6px;
                background: var(--text-color);
                color: var(--bg-color);
                cursor: pointer;
                font-size: 0.9em;
                transition: all 0.3s ease;
                font-weight: 500;
            }
            .item-action-btn:hover {
                opacity:0.7;
            }
            .item-card.selected {
                border-color: #4CAF50;
                background: rgba(76, 175, 80, 0.1);
                box-shadow: 0 0 10px rgba(76, 175, 80, 0.3);
            }
            .item-card.locked {
                opacity: 0.6;
                filter: grayscale(100%);
            }
            .selection-indicator {
                width: 20px;
                height: 20px;
                border: 2px solid #ddd;
                border-radius: 50%;
                background: transparent;
                position: absolute;
                top: 10px;
                left: 10px;
                flex-shrink: 0;
                transition: all 0.3s ease;
                z-index: 10;
            }
            .selection-indicator.selected {
                background: #4CAF50;
                border-color: #4CAF50;
            }
            .selection-indicator.selected::after {
                content: '✓';
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                color: white;
                font-size: 12px;
                font-weight: bold;
            }
            .locked-overlay {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
            }
            .lock-icon {
                font-size: 48px;
                margin-bottom: 5px;
                opacity: 0.8;
            }
            .lock-text {
                color: white;
                background: #FF5722;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: bold;
            }
            .ui-multi-select-footer {
                padding: 15px 20px 40px 20px; /* 增加底部空白适应iPhone安全区域 */
                background: var(--bg-color);
                border-top: 1px solid var(--border-color);
                display: flex;
                justify-content: space-around;
                position: fixed;
                bottom: 0;
                left: 0;
                right: 0;
                z-index: 1001;
            }
            .ui-footer-btn {
                padding: 12px 20px;
                border: 2px solid var(--border-color);
                border-radius: 8px;
                background: var(--text-color);
                color: var(--bg-color);
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: all 0.3s ease;
            }
            .ui-footer-btn:hover:not(.disabled) {
                opacity: 0.8;
                transform: translateY(-1px);
            }
            .ui-footer-btn.disabled {
                background: #aaa;
                color: #666;
                cursor: not-allowed;
                opacity: 0.6;
            }
            .dark .ui-footer-btn.disabled {
                background: #444;
                color: #888;
            }
            .cost-bubble {
                position: absolute;
                top: 8px;
                right: 8px;
                font-size: 12px;
                font-weight: bold;
                padding: 4px 8px;
                border-radius: 12px;
                background: linear-gradient(135deg, #4CAF50, #66BB6A);
                color: white;
                box-shadow: 0 2px 4px rgba(76, 175, 80, 0.3);
                z-index: 15;
                border: 2px solid rgba(255, 255, 255, 0.3);
                display: flex;
                align-items: center;
                gap: 2px;
            }
            .dark .cost-bubble {
                background: linear-gradient(135deg, #388E3C, #4CAF50);
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.5);
            }
            .unlocked-banner {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                background: linear-gradient(45deg, #FFD700, #FFA500);
                color: #000;
                font-size: 10px;
                font-weight: bold;
                text-align: center;
                padding: 2px 0;
                border-radius: 6px 6px 0 0;
                z-index: 20;
                text-shadow: 1px 1px 2px rgba(255, 255, 255, 0.5);
            }
            .item-action-btn.disabled {
                background: #ccc !important;
                color: #888 !important;
                cursor: not-allowed;
                pointer-events: none;
            }
            .dark .item-action-btn.disabled {
                background: #555 !important;
                color: #aaa !important;
            }
            .item-action-btn.unlocked {
               
                color: #aaa !important;
                background-color:transparent;
            }
          
            .item-card.locked .item-card-actions {
                pointer-events: none;
            }
            .item-card-text-part {
                width: 100%;
            }
            .item-card-text-container {
                flex: 1;
                display: flex;
                flex-direction: column;
                min-width: 0;
            }
            .ui-multi-select-panel .ui-modal-content {
                width: 100vw;
                max-width: 100vw;
                height: 100vh;
                max-height: 100vh;
                border-radius: 0;
                display: flex;
                flex-direction: column;
                overflow-y: auto;
            }
            .ui-multi-select-content {
                flex: 1;
                display: flex;
                flex-direction: column;
            }
            .ui-options-container {
                max-height: 400px;
                overflow-y: auto;
                margin-bottom: 15px;
            }
            .option-item {
                display: flex;
                align-items: center;
                padding: 12px 15px;
                margin-bottom: 8px;
                border: 1px solid var(--border-color);
                border-radius: 8px;
                background: var(--bg-color);
                cursor: pointer;
                transition: all 0.3s ease;
                position: relative;
                min-height: 60px;
            }
            .option-item:hover:not(.disabled) {
                border-color: #007bff;
                background: rgba(0,123,255,0.05);
                transform: translateY(-1px);
            }
            .option-item:selected {
                border-color: #28a745;
                background: rgba(40,167,69,0.08);
            }
            .option-item:disabled {
                background: var(--border-color);
                opacity: 0.6;
                cursor: not-allowed;
            }
            .dark .option-item:disabled {
                background: rgba(80,80,80,0.5);
            }
            .option-content {
                flex: 1;
                margin-left: 15px;
            }
            .option-name {
                font-weight: bold;
                color: var(--text-color);
                margin-bottom: 4px;
            }
            .option-desc {
                font-size: 0.9em;
                color: #666;
                line-height: 1.4;
            }
            .dark .option-desc {
                color: #aaa;
            }
            .ui-selection-info {
                text-align: center;
                padding: 10px 0;
                color: var(--text-color);
                border-bottom: 1px solid var(--border-color);
                margin-bottom: 10px;
            }
            .ui-paypal-container {
                position: fixed;
                bottom: 0;
                left: 0;
                width: 100%;
                background: var(--bg-color);
                color: var(--text-color);
                padding: 20px;
                border-top: 1px solid var(--border-color);
                box-shadow: 0 -5px 15px var(--shadow-color);
                transition: transform 0.3s ease;
                transform: translateY(100%);
                z-index: 1000;
                text-align: center;
            }
            .ui-paypal-container.show {
                transform: translateY(0);
            }
        `;
        document.head.appendChild(style);
    }

    showToast(message) {
        const toast = document.createElement('div');
        toast.className = 'ui-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        setTimeout(() => toast.classList.add('show'), 10);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => document.body.removeChild(toast), 300);
        }, 3000);
    }

    showConfirmPanel(title, description, image, callback) {
        const modal = document.createElement('div');
        modal.className = 'ui-modal ui-confirm-panel';
        const imageHtml = image ?
            (typeof image === 'string' && !image.startsWith('http') ?
                `<div class="emoji">${image}</div>` :
                `<img src="${image}" alt="${title}">`) :
            '';
        modal.innerHTML = `
            <div class="ui-modal-content">
                <h2>${title}</h2>
                <p>${description}</p>
                ${imageHtml}
                <div class="ui-confirm-btns">
                    <button class="ui-btn cancel">${t('cancel')}</button>
                    <button class="ui-btn ok">${t('ok')}</button>
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const cancelBtn = modal.querySelector('.cancel');
        const okBtn = modal.querySelector('.ok');

        const handleAction = (confirmed) => {
            if (callback) callback(confirmed);
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        cancelBtn.addEventListener('click', () => handleAction(false));
        okBtn.addEventListener('click', () => handleAction(true));

        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                handleAction(false);
            }
        });

        setTimeout(() => modal.classList.add('show'), 10);
    }

    showOptionsPanel(title, description, options, callback,hasCancel) {


        if(hasCancel===null || typeof (hasCancel)=="undefined")
        {
            hasCancel=true;
        }
        const modal = document.createElement('div');
        modal.className = 'ui-modal ui-options-panel';
        // const hasCancel = true;
        const cancelBtnHtml = `<button class="ui-btn cancel">${t('cancel')}</button>`;
        modal.innerHTML = `
            <div class="ui-modal-content">
                <div class="ui-options-header">
                    <h2>${title}</h2>
                    <p>${description}</p>
                </div>
                <ul class="ui-options-list">
                    ${options.map((opt, index) => {
                        const imageHtml = opt.image ?
                            (typeof opt.image === 'string' && !opt.image.startsWith('http') ?
                                `<div class="emoji item-icon">${opt.image}</div>` :
                                `<img class="item-icon" src="${opt.image}" alt="${opt.text}">`) :
                            '';
                        return `
                        <li class="ui-option" data-index="${index}">
                            <div class="text">
                                <strong>${imageHtml ? (typeof opt.image === 'string' && !opt.image.startsWith('http') ? opt.image + ' ' : '') + opt.text : opt.text}</strong>
                                ${opt.desc ? `<div class="desc">${opt.desc}</div>` : ''}
                            </div>
                            ${imageHtml && typeof opt.image === 'string' && opt.image.startsWith('http') ? imageHtml : ''}
                        </li>
                        `;
                    }).join('')}
                </ul>
                <div class="ui-options-actions">
                    ${hasCancel ? `<button class="ui-btn cancel">${t('cancel')}</button>` : ''}
                </div>
            </div>
        `;
        document.body.appendChild(modal);

        const optionsEls = modal.querySelectorAll('.ui-option');

        const handleAction = (result) => {
            let callbackResult;
            if (result === 'cancel') {
                callbackResult = { cancel: true };
            } else {
                callbackResult = result;  // { selected: ..., index: ... }
            }
            if (callback) callback(callbackResult);
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        };

        optionsEls.forEach(el => {
            el.addEventListener('click', () => {
                let data=options[el.dataset.index];
                handleAction(data);
            });
        });

        if (hasCancel) {
            modal.querySelector('.cancel').addEventListener('click', () => handleAction({ cancel: true }));
        }

        setTimeout(() => modal.classList.add('show'), 10);
    }

    showWaiting(text = t('matching'), time = 30, onCancel) {
        this.hideWaiting(); // 如果有之前的，隐藏
        const modal = document.createElement('div');
        modal.className = 'ui-waiting-modal';
        modal.innerHTML = `
            <div class="ui-waiting-content">
                <div class="ui-waiting-text">${text}</div>
                <div class="ui-progress-bar">
                    <div class="ui-progress-fill" style="width: 0%;"></div>
                </div>
                <button class="ui-waiting-cancel">${t('cancel')}</button>
            </div>
        `;
        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        const progressFill = modal.querySelector('.ui-progress-fill');
        const cancelBtn = modal.querySelector('.ui-waiting-cancel');
        let progress = 0;
        const step = 90 / time; // 每秒增加多少%

        this.waitingInterval = setInterval(() => {
            progress += step;
            if (progress >= 90) {
                progress = 90;
                clearInterval(this.waitingInterval);
            }
            progressFill.style.width = progress + '%';
        }, 1000);

        cancelBtn.addEventListener('click', () => {
            this.hideWaiting();
            if (onCancel) onCancel();
        });

        this.waitingModal = modal;
    }

    hideWaiting() {
        if (this.waitingInterval) {
            clearInterval(this.waitingInterval);
            this.waitingInterval = null;
        }
        if (this.waitingModal) {
            this.waitingModal.classList.remove('show');
            setTimeout(() => {
                if (this.waitingModal.parentNode) {
                    document.body.removeChild(this.waitingModal);
                }
                this.waitingModal = null;
            }, 300);
        }
    }

    /**
     * 显示物品列表面板
     * @param {Object} config - 配置对象
     * @param {string} config.title - 面板标题
     * @param {Array} config.items - 物品数组，每个物品包含：id, image, name, description, actions, cost?, unlocked?
     * @param {Function} config.onAction - 操作回调函数
     * @param {boolean} config.stretch - 是否拉伸填充整个窗口（默认为true）
     * @param {boolean} config.searchable - 是否启用搜索功能（默认为false）
     */
    showItemListPanel(config) {
        const {
            title,
            items,
            onAction,
            stretch = true,
            searchable = false
        } = config;

        // 隐藏现有的面板
        this.hideItemListPanel();

        const modal = document.createElement('div');
        modal.className = 'ui-modal ui-item-list-panel';
        modal.innerHTML = `
            <div class="ui-modal-content ${stretch ? 'stretch' : ''}">
                <div class="ui-item-list-header">
                    <h2>${title}</h2><span id='top_up' class='ui-footer-btn'>${t('top_up')}</span>
                    ${searchable ? `
                        <div class="ui-search-container">
                            <input type="text"  placeholder="${t('search')}" class="ui-search-input">
                        </div>
                    ` : ''}
                    <button class="ui-close-btn">×</button>
                </div>
                <div class="ui-item-list-container">
                    <div class="ui-item-grid" id="itemGrid">
                        ${items.map((item, index) => {
                            const imageHtml = item.image ?
                                (typeof item.image === 'string' && !item.image.startsWith('http') && !item.image.startsWith('data:') ?
                                    `<div class="item-card-emoji">${item.image}</div>` :
                                    `<img class="item-card-image" src="${item.image}" alt="${item.name}">`) :
                                '<div class="item-card-placeholder">📦</div>';

                            // 检查是否已解锁，用于显示样式
                            const isUnlocked = item.unlocked !== false; // 默认为true
                            const cost = item.cost;
                            const showCostBubble = cost !== undefined;
                            const showUnlockedBanner = !isUnlocked;

                            return `
                                <div class="item-card ${!isUnlocked ? 'locked' : ''}" data-id="${item.id}" data-index="${index}">
                                    <div class="item-card-image-container">
                                        ${imageHtml}
                                        ${showCostBubble ? `<div class="cost-bubble">${cost}💧</div>` : ''}
                                        ${showUnlockedBanner ? `<div class="unlocked-banner">已解锁</div>` : ''}
                                    </div>
                                    <div class="item-card-text-container">
                                        <div class="item-card-text-part">
                                            <h3 class="item-card-title">${item.name}</h3>
                                            ${item.description ? `<p class="item-card-description">${item.description}</p>` : ''}
                                        </div>
                                        <div class="item-card-spacer"></div>
                                        ${item.actions && item.actions.length ? `
                                            <div class="item-card-actions">
                                                ${item.actions.map(action => {
                                                    let buttonClass = 'item-action-btn';
                                                    let buttonAttributes = `data-action="${action.key}" data-item-id="${item.id}" data-index="${index}"`;

                                                    if (!isUnlocked) {
                                                        buttonClass += ' disabled';
                                                        buttonAttributes += ' disabled';
                                                    } else if (action.key === 'unlocked') {
                                                        buttonClass += ' unlocked';
                                                    } else if (action.disabled) {
                                                        buttonClass += ' disabled';
                                                        buttonAttributes += ' disabled';
                                                    }

                                                    return `<button class="${buttonClass}" ${buttonAttributes}>${action.text}</button>`;
                                                }).join('')}
                                            </div>
                                        ` : ''}
                                    </div>
                                </div>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        setTimeout(() => modal.classList.add('show'), 10);

        // 绑定事件
        const closeBtn = modal.querySelector('.ui-close-btn');
        const itemGrid = modal.querySelector('#itemGrid');
        const searchInput = modal.querySelector('.ui-search-input');
        const topUpBtn = modal.querySelector('#top_up');

        const handleAction = (result) => {
            if (onAction) onAction(result);
            if (result.close) {
                this.hideItemListPanel();
            }
        };

        // 绑定充值按钮事件
        if (topUpBtn) {
            topUpBtn.addEventListener('click', () => {
                if (typeof ButtonManager !== 'undefined' && ButtonManager.topUp) {
                    ButtonManager.topUp();
                } else {
                    this.showToast(t('top_up') + '功能不可用');
                }
            });
        }

        closeBtn.addEventListener('click', () => handleAction({ close: true }));

        itemGrid.addEventListener('click', (e) => {
            const actionBtn = e.target.closest('.item-action-btn');
            if (actionBtn) {
                e.stopPropagation();
                const itemId = actionBtn.dataset.itemId;
                const itemIndex = actionBtn.dataset.index;
                const actionKey = actionBtn.dataset.action;
                const item = items[itemIndex];

                handleAction({
                    type: 'action',
                    itemId: itemId,
                    itemIndex: parseInt(itemIndex),
                    item: item,
                    action: actionKey
                });
                return;
            }

            const itemCard = e.target.closest('.item-card');
            if (itemCard) {
                const itemIndex = itemCard.dataset.index;
                const item = items[itemIndex];
                handleAction({
                    type: 'select',
                    itemId: item.id,
                    itemIndex: parseInt(itemIndex),
                    item: item
                });
            }
        });

        // NOTE: 移除了这个监听，因为它会造成点击任何地方都关闭的问题
        // modal.addEventListener('click', (e) => {
        //     if (e.target === modal) {
        //         handleAction({ close: true });
        //     }
        // });

        // 搜索功能
        if (searchable && searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const itemCards = modal.querySelectorAll('.item-card');

                itemCards.forEach(card => {
                    const name = card.querySelector('.item-card-title').textContent.toLowerCase();
                    const desc = card.querySelector('.item-card-description')?.textContent.toLowerCase() || '';
                    const visible = name.includes(query) || desc.includes(query);

                    card.style.display = visible ? 'block' : 'none';
                });
            });
        }

        this.itemListModal = modal;
    }

    /**
     * 隐藏物品列表面板
     */
    hideItemListPanel() {
        if (this.itemListModal) {
            this.itemListModal.classList.remove('show');
            if (this.itemListModal.parentNode) {
                document.body.removeChild(this.itemListModal);
            }
            // this.itemListModal = null;
            // setTimeout(() => {
            //
            // }, 300);
        }
    }

    /**
     * 显示多选面板 - 借鉴showItemListPanel样式，支持最小/最大选择限制
     * @param {Object} config - 配置对象
     * @param {string} config.title - 面板标题
     * @param {string} config.description - 面板描述
     * @param {Array} config.options - 选项数组，每个选项包含：id, name, description, image等 (参考showItemListPanel的items格式，但增加selected属性)
     * @param {number} config.minSelect - 最少选择数量 (默认为0)
     * @param {number} config.maxSelect - 最多选择数量 (默认为选项总数)
     * @param {boolean} config.searchable - 是否启用搜索功能 (默认为false)
     * @param {boolean} config.stretch - 是否拉伸填充整个窗口 (默认为true)
     * @param {Function} config.onConfirm - 确认回调函数，参数为选中的选项数组
     * @param {Function} config.onCancel - 取消回调函数
     */
    showMultiSelectPanel_can_be_edit(config) {
        const {
            title,
            description = '',
            options,
            minSelect = 0,
            maxSelect = options.length,
            searchable = false,
            stretch = true,
            onConfirm,
            onCancel
        } = config;

        // 隐藏现有的面板
        this.hideMultiSelectPanel();

        // 创建唯一的ID和变量名，避免与其他 Petite Vue 实例冲突
        const uniqueId = `multi-select-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const dataVarName = `multiSelectData_${uniqueId.replace(/-/g, '_')}`;

        // 定义Petite Vue数据和方法
        const multiSelectData = {
            options: options.map(opt => ({
                id: opt.id,
                name: opt.name,
                description: opt.description,
                selected: opt.selected || false,  // 使用传入的selected属性
                disabled: opt.disabled || false    // 也支持传入的disabled属性
            })),
            minSelect,
            maxSelect,
            totalOptions: options.length,

            get selectedCount() {
                return this.options.filter(opt => opt.selected).length;
            },

            get canConfirm() {
                const count = this.selectedCount;
                return count >= this.minSelect && count <= this.maxSelect;
            },

            toggleSelection(index) {
                const option = this.options[index];
                if (option.disabled) return;

                if (option.selected) {
                    // 取消选择
                    option.selected = false;
                } else {
                    // 检查是否超过最大选择数量
                    if (this.selectedCount >= this.maxSelect) {
                        this.ui.showToast(`最多只能选择 ${this.maxSelect} 项`);
                        return;
                    }
                    option.selected = true;
                }

                // 更新选项的disabled状态
                this.updateDisabledStates();
            },

            updateDisabledStates() {
                const selectedCount = this.selectedCount;
                const canSelectMore = selectedCount < this.maxSelect;

                this.options.forEach(option => {
                    if (option.selected) {
                        option.disabled = false; // 已选中的可以取消
                    } else {
                        option.disabled = !canSelectMore; // 未选中的，如果不能再选更多就禁用
                    }
                });
            },

            handleConfirm() {
                if (!this.canConfirm) return;

                const selectedOptions = this.options.filter(opt => opt.selected);
                this.ui.hideMultiSelectPanel();
                if (onConfirm) onConfirm(selectedOptions);
            },

            handleCancel() {
                this.ui.hideMultiSelectPanel();
                if (onCancel) onCancel();
            },

            ui: this, // 引用UI实例
        };

        // 初始化disabled状态
        multiSelectData.updateDisabledStates();

        // 创建面板HTML，借鉴showItemListPanel的样式和布局
        const modal = document.createElement('div');
        modal.className = 'ui-modal ui-multi-select-panel ui-item-list-panel';

        // 构建选项HTML，使用item-card样式
        const optionsHtml = multiSelectData.options.map((option, index) => {
            const imageHtml = option.image ?
                (typeof option.image === 'string' && !option.image.startsWith('http') && !option.image.startsWith('data:') ?
                    `<div class="item-card-emoji">${option.image}</div>` :
                    `<img class="item-card-image" src="${option.image}" alt="${option.name}">`) :
                '<div class="item-card-placeholder">📦</div>';

            return `
                <div class="item-card ${option.selected ? 'selected' : ''} ${option.disabled ? 'locked' : ''}"
                     data-index="${index}">
                    <div class="item-card-image-container">
                        <div class="selection-indicator ${option.selected ? 'selected' : ''}"></div>
                        ${imageHtml}
                    </div>
                    <div class="item-card-text-container">
                        <div class="item-card-text-part">
                            <h3 class="item-card-title">${option.name}</h3>
                            ${option.description ? `<p class="item-card-description">${option.description}</p>` : ''}
                        </div>
                        <div class="item-card-spacer"></div>
                    </div>
                </div>
            `;
        }).join('');

        // 定义面板的HTML结构，借鉴showItemListPanel
        modal.innerHTML = `
            <div class="ui-modal-content ${stretch ? 'stretch' : ''}">
                <div class="ui-item-list-header">
                    <h2>${title}</h2>
                    ${searchable ? `
                        <div class="ui-search-container">
                            <input type="text" placeholder="${t('search')}" class="ui-search-input">
                        </div>
                    ` : ''}
                    <button class="ui-close-btn">×</button>
                </div>
                 <!-- 选择信息显示 -->
                        <div class="ui-selection-info">
                            ${t('selected')}: <strong>
                            ${multiSelectData.selectedCount}</strong>
                            <span>${minSelect > 0 || maxSelect < options.length ? `(${minSelect}-${maxSelect} items)` : `(${t('max_select')} ${maxSelect} )`}</span>
                        </div>
                <div class="ui-item-list-container">
                    <div class="ui-item-grid" id="multiSelectGrid">
                        <!-- 选项卡片 -->
                        ${optionsHtml}
                    </div>

                    <!-- 悬浮底部按钮 -->
                    <div class="ui-multi-select-footer">
                        <button class="ui-footer-btn cancel-btn">${t('cancel')}</button>
                        <button class="ui-footer-btn confirm-btn ${!multiSelectData.canConfirm ? 'disabled' : ''}" ${!multiSelectData.canConfirm ? 'disabled' : ''}>
                            ${t('confirm')}
                        </button>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);

        // 存储数据到modal元素上，以便后续更新
        modal._multiSelectData = multiSelectData;

        // 绑定事件
        this.bindMultiSelectEvents(modal);

        setTimeout(() => modal.classList.add('show'), 10);

        this.multiSelectModal = modal;
    }

    /**
     * 绑定多选面板的事件
     */
    bindMultiSelectEvents(modal) {
        const data = modal._multiSelectData;
        const multiSelectGrid = modal.querySelector('#multiSelectGrid');
        const closeBtn = modal.querySelector('.ui-close-btn');
        const cancelBtn = modal.querySelector('.cancel-btn');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const searchInput = modal.querySelector('.ui-search-input');

        // 选项点击事件 (使用类似showItemListPanel的实现)
        multiSelectGrid.addEventListener('click', (e) => {
            const itemCard = e.target.closest('.item-card');
            if (itemCard && !itemCard.classList.contains('locked')) {
                const index = parseInt(itemCard.dataset.index);
                data.toggleSelection(index);

                // 更新UI
                this.updateMultiSelectUI(modal);
            }
        });

        // 关闭按钮事件
        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                data.handleCancel();
            });
        }

        // 取消按钮事件
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                data.handleCancel();
            });
        }

        // 确认按钮事件
        if (confirmBtn) {
            confirmBtn.addEventListener('click', () => {
                data.handleConfirm();
            });
        }

        // 搜索功能
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const query = e.target.value.toLowerCase();
                const itemCards = modal.querySelectorAll('.item-card');

                itemCards.forEach(card => {
                    const name = card.querySelector('.item-card-title').textContent.toLowerCase();
                    const desc = card.querySelector('.item-card-description')?.textContent.toLowerCase() || '';
                    const visible = name.includes(query) || desc.includes(query);

                    card.style.display = visible ? 'flex' : 'none';
                });
            });
        }

        // 初始化UI显示
        this.updateMultiSelectUI(modal);
    }

    /**
     * 更新多选面板的UI显示
     */
    updateMultiSelectUI(modal) {
        const data = modal._multiSelectData;
        const selectionInfo = modal.querySelector('.ui-selection-info strong');
        const confirmBtn = modal.querySelector('.confirm-btn');
        const itemCards = modal.querySelectorAll('.item-card');

        // 更新选择数量显示
        if (selectionInfo) {
            selectionInfo.textContent = data.selectedCount;
        }

        // 更新确认按钮状态
        if (confirmBtn) {
            if (data.canConfirm) {
                confirmBtn.disabled = false;
                confirmBtn.classList.remove('disabled');
            } else {
                confirmBtn.disabled = true;
                confirmBtn.classList.add('disabled');
            }
        }

        // 更新选项状态 (使用item-card样式)
        itemCards.forEach((item, index) => {
            const option = data.options[index];
            const indicator = item.querySelector('.selection-indicator');

            item.classList.toggle('selected', option.selected);
            item.classList.toggle('locked', option.disabled);
            if (indicator) {
                indicator.classList.toggle('selected', option.selected);
            }
        });
    }

    /**
     * 隐藏多选面板
     */
    hideMultiSelectPanel() {
        if (this.multiSelectModal) {
            this.multiSelectModal.classList.remove('show');
            setTimeout(() => {
                if (this.multiSelectModal.parentNode) {
                    document.body.removeChild(this.multiSelectModal);
                }
                this.multiSelectModal = null;
            }, 300);
        }
    }

    hideMultiSelectPanel = this.hideMultiSelectPanel.bind(this); // 确保上下文正确

    /**
     * 显示底部PayPal容器 - 包含Loading文本和取消按钮
     */
    showPaypalContainer_can_be_edit() {
        // 隐藏现有的容器
        this.hidePaypalContainer_can_be_edit();


        let container_out = document.createElement('div');
        container_out.innerHTML=`
            <div class="ui-paypal-loading" style='margin-bottom:20px;'>PayPal</div>
        `;
        container_out.className = 'ui-paypal-container';

        // 创建容器
        let container = document.createElement('div');
        container.id = 'paypal-button-container';

        container.innerHTML = `
            <div></div>
        `;

        container_out.appendChild(container);

        const container1 = document.createElement('div');

        container1.innerHTML=`
            <button style='margin-bottom:20px;' 
            class="ui-btn cancel paypal-cancel-btn">${t('cancel')}</button>
        `;
        container_out.appendChild(container1);

        document.body.appendChild(container_out);

        let that=this;
        // 绑定取消按钮事件
        setTimeout(function(){
            const cancelBtn = container_out.querySelector('.paypal-cancel-btn');
            // if(cancelBtn)
            {
                cancelBtn.addEventListener('click', () => {
                    that.hidePaypalContainer_can_be_edit();
                });
            }

        },500);

        // 添加显示类，使其从下方滑入
        setTimeout(() => container_out.classList.add('show'), 10);

        this.paypalContainer = container_out;
    }

    /**
     * 隐藏PayPal容器
     */
    hidePaypalContainer_can_be_edit() {
        if (this.paypalContainer) {
            this.paypalContainer.classList.remove('show');
            setTimeout(() => {
                if (this.paypalContainer.parentNode) {
                    document.body.removeChild(this.paypalContainer);
                }
                this.paypalContainer = null;
            }, 300);
        }
    }
}

class TransBasic {

    static lang = 'en';

    static setLan(lang) {
        this.lang = lang;
    }

    static t(key) {
        const dict = this.translations[this.lang] || this.translations['zh'];
        return dict[key] || key;
    }

    static translations = {
        'zh': {
            'openSoundEffect': '打开音效',
            "closeSoundEffect":"关闭音效",
            'confirm': '确认',
            'cancel': '取消',
            'ok': '确定',
            'waitingFriend': '等待朋友加入...',
            'confirmJoinRoom': '是否加入房间 {roomid}?',
            'canceledJoinRoom': '已取消加入房间',
            'waitingForPlayAgain': '等待再来一局...',
            'matching': '匹配中...',
            'opponentDisconnected': '对手已断开连接，请等待',
            'slogan': '指挥您的军队，争夺胜利！',
            'playerInfo': '玩家等级：{level}级，总分（{score}）',
            'startGame': '开始游戏',
            'home': '游戏首页',
            'logout': '退出登录',
            'testArea': '开发者测试区域',
            'exitGame': '退出游戏',
            'testWin': '测试胜利',
            'loginFailed': '无法进行登录操作',
            'roomCreationFailed': '创建房间失败',
            'shareCopied': '已复制对战链接，请分享给你的朋友',
            'shareFailed': '连接复制失败',
            'gameStarted': '游戏开始！',
            'confirmLogout': '确认退出登录吗？',
            'confirmExitGame': '确认退出游戏吗？',
            'exitSuccess': '退出成功',
            'connectionNotEstablished': '连接未建立，无法测试退出',
            'confirmTestWin': '测试：确认测试胜利吗？',
            'testWinAlert': '测试胜利',
            'userIdNotFound': '用户ID未找到，无法测试胜利',
            'gameEngineNotStarted': '游戏引擎未启动，无法测试胜利',
            'returnToHome': '返回游戏首页',
            'makeNewGame': '我也要做一个游戏',
            'continueFight': '续战',
            'menu': '菜单',
            'gameMenu': '游戏菜单',
            'exitToMenu': '退出游戏',
            'confirmExitToMenu': '确定要退出游戏吗？这将结束当前房间并通知对手。',
            'gameOverWin': '🎉 胜利！🎉',
            'gameOverLose': '😢 失败 😢',
            'confirmExit': '退出游戏吗？',
            'waiting': '等待中...',
            "repeatUser": "您不能接受自己的邀请",
            'waitingForFriend': '等待朋友...',
            'search': '搜索',
            'selected': '已选择',
            'item_unit': '项',
            'need_select': '需选择',
            'max_select': '最多可选择',
            'select_combat_units': '选择出战兵种',
            'unit_unlock_management': '兵种解锁管理',
            'unit_locked_desc': '此单位需要解锁才能使用',
            'unlock_condition': '解锁条件',
            'unlock_cost_10': '消耗10积分解锁',
            'unit_selection_saved': '兵种选择保存成功',
            'units': '个兵种',
            'contains_unlocked_units': '包含未解锁单位',
            'selection_contains_locked_units': '选择的兵种中包含未解锁的单位，请先解锁这些单位。',
            'locked_units_label': '未解锁单位',
            // 添加更多如果需要
        },
        'en': {
            'openSoundEffect': 'Open Sound Effect',
            "closeSoundEffect":"Close Sound Effect",
            'confirm': 'Confirm',
            'cancel': 'Cancel',
            'ok': 'OK',
            'waitingFriend': 'Waiting for friend...',
            'confirmJoinRoom': 'Join room {roomid}?',
            'canceledJoinRoom': 'Join room canceled',
            'waitingForPlayAgain': 'Waiting for play again...',
            'matching': 'Matching...',
            'opponentDisconnected': 'Opponent disconnected, please wait',
            'slogan': 'Command your army and fight for victory!',
            'playerInfo': 'Player Level: {level}, Total Score: ({score})',
            'startGame': 'Start Game',
            'home': 'Game Home',
            'logout': 'Logout',
            'testArea': 'Developer Test Area',
            'exitGame': 'Exit Game',
            'testWin': 'Test Win',
            'loginFailed': 'Unable to perform login operation',
            'roomCreationFailed': 'Failed to create room',
            'shareCopied': 'Battle link copied, please share with your friends',
            'shareFailed': 'Failed to copy link',
            'gameStarted': 'Game Started!',
            'confirmLogout': 'Confirm logout?',
            'confirmExitGame': 'Confirm exit game?',
            'exitSuccess': 'Exit successful',
            'connectionNotEstablished': 'Connection not established, cannot test exit',
            'confirmTestWin': 'Test: Confirm test win?',
            'testWinAlert': 'Test Win',
            'userIdNotFound': 'User ID not found, cannot test win',
            'gameEngineNotStarted': 'Game engine not started, cannot test win',
            'returnToHome': 'Return to Game Home',
            'makeNewGame': 'I want to make a game too',
            'continueFight': 'Play Again',
            'menu': 'Menu',
            'gameMenu': 'Game Menu',
            'exitToMenu': 'Exit Game',
            'confirmExitToMenu': 'Are you sure to exit the game? This will end the current room and notify your opponent.',
            'gameOverWin': '🎉 Victory! 🎉',
            'gameOverLose': '😢 Defeat 😢',
            'confirmExit': 'Exit game?',
            'waiting': 'Waiting...',
            "repeatUser": "You can't accept your own invitation",
            'waitingForFriend': 'Waiting for friend...',
            'search': 'Search',
            'selected': 'Selected',
            'item_unit': 'item(s)',
            'need_select': '',
            'max_select': 'Max select',
            // 添加更多如果需要
        }
    };
}
