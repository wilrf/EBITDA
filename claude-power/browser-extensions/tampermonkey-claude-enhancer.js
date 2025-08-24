// ==UserScript==
// @name         EBITDA Claude Power Commands
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Adds quick command buttons and shortcuts to Claude.ai for EBITDA development
// @author       EBITDA Developer
// @match        https://claude.ai/*
// @match        https://www.claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// ==/UserScript==

(function() {
    'use strict';

    // System prompts and templates
    const PROMPTS = {
        init: `You are EBITDA-Claude, a specialized AI assistant for developing a private equity simulation game.

## Core Context
- **Project**: Private Equity firm simulation game (EBITDA)
- **Tech Stack**: TypeScript/React, Rust WASM, Go backend
- **Performance**: 60 FPS, 10,000+ AI entities
- **Constraint**: Deterministic simulation

## Rules
1. Code > Explanations
2. Performance First
3. Type Safety Always
4. Error Handling Required

Acknowledge with: "EBITDA-Claude initialized. Ready to build high-performance PE simulation systems."`,

        morning: `# Daily Standup - ${new Date().toISOString().split('T')[0]}

## Yesterday
- Completed: [WHAT]

## Today's Focus
- Priority 1: [TASK]

## Questions for Claude:
1. `,

        review: `Review this EBITDA game code for:
- Performance (must maintain 60 FPS)
- Memory leaks
- Determinism issues
- Best practices

\`\`\`typescript
// PASTE CODE HERE
\`\`\``,

        optimize: `Optimize this EBITDA game code for performance while maintaining determinism and 60 FPS:

\`\`\`typescript
// PASTE CODE HERE
\`\`\``,

        bug: `Debug this EBITDA game issue:

Error: [ERROR MESSAGE]
Stack: [STACK TRACE]

Code:
\`\`\`typescript
// PASTE CODE HERE
\`\`\`

What's the root cause and fix?`,

        test: `Generate comprehensive tests for this EBITDA game code, including unit tests, edge cases, and determinism verification:

\`\`\`typescript
// PASTE CODE HERE
\`\`\``,

        feature: `Design and implement [FEATURE_NAME] for the EBITDA game:

Requirements:
- [REQUIREMENT_1]
- [REQUIREMENT_2]

Constraints:
- Must be deterministic
- Max 200 lines
- Performance: O(n) or better`,

        architect: `Design the architecture for [SYSTEM] in the EBITDA game:

Scale: [SCALE_REQUIREMENT]
Performance: 60 FPS with 10k entities
Deterministic: Yes

Provide:
1. Architecture overview
2. Key interfaces
3. Data flow
4. Implementation approach`
    };

    // Add styles
    GM_addStyle(`
        #ebitda-toolbar {
            position: fixed;
            top: 10px;
            right: 10px;
            z-index: 10000;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            gap: 4px;
            transition: all 0.3s ease;
        }

        #ebitda-toolbar.collapsed {
            padding: 4px;
        }

        #ebitda-toolbar.collapsed .ebitda-btn:not(.toggle-btn) {
            display: none;
        }

        .ebitda-btn {
            background: white;
            color: #4a5568;
            border: none;
            padding: 8px 12px;
            border-radius: 8px;
            cursor: pointer;
            font-size: 13px;
            font-weight: 600;
            transition: all 0.2s ease;
            white-space: nowrap;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .ebitda-btn:hover {
            background: #f7fafc;
            transform: translateX(-2px);
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        .ebitda-btn.primary {
            background: #48bb78;
            color: white;
        }

        .ebitda-btn.primary:hover {
            background: #38a169;
        }

        .ebitda-btn.toggle-btn {
            background: rgba(255,255,255,0.2);
            color: white;
            padding: 4px 8px;
            font-size: 18px;
        }

        .ebitda-separator {
            height: 1px;
            background: rgba(255,255,255,0.3);
            margin: 4px 0;
        }

        #ebitda-status {
            position: fixed;
            bottom: 20px;
            right: 20px;
            background: #48bb78;
            color: white;
            padding: 12px 20px;
            border-radius: 8px;
            font-weight: 600;
            opacity: 0;
            transform: translateY(20px);
            transition: all 0.3s ease;
            z-index: 10001;
        }

        #ebitda-status.show {
            opacity: 1;
            transform: translateY(0);
        }

        .ebitda-shortcut {
            font-size: 10px;
            opacity: 0.7;
            margin-left: auto;
        }
    `);

    // Create toolbar
    function createToolbar() {
        const toolbar = document.createElement('div');
        toolbar.id = 'ebitda-toolbar';
        
        // Toggle button
        const toggleBtn = document.createElement('button');
        toggleBtn.className = 'ebitda-btn toggle-btn';
        toggleBtn.innerHTML = '🎮';
        toggleBtn.title = 'Toggle EBITDA Toolbar';
        toggleBtn.onclick = () => {
            toolbar.classList.toggle('collapsed');
            localStorage.setItem('ebitda-toolbar-collapsed', toolbar.classList.contains('collapsed'));
        };
        
        // Command buttons
        const buttons = [
            { text: '🚀 Init EBITDA', key: 'init', shortcut: 'Alt+I', primary: true },
            { text: '📅 Morning', key: 'morning', shortcut: 'Alt+M' },
            { text: '🔍 Review', key: 'review', shortcut: 'Alt+R' },
            { text: '⚡ Optimize', key: 'optimize', shortcut: 'Alt+O' },
            { text: '🐛 Debug', key: 'bug', shortcut: 'Alt+B' },
            { text: '🧪 Test', key: 'test', shortcut: 'Alt+T' },
            { text: '✨ Feature', key: 'feature', shortcut: 'Alt+F' },
            { text: '🏗️ Architect', key: 'architect', shortcut: 'Alt+A' }
        ];
        
        toolbar.appendChild(toggleBtn);
        
        const separator = document.createElement('div');
        separator.className = 'ebitda-separator';
        toolbar.appendChild(separator);
        
        buttons.forEach(btn => {
            const button = document.createElement('button');
            button.className = btn.primary ? 'ebitda-btn primary' : 'ebitda-btn';
            button.innerHTML = `${btn.text} <span class="ebitda-shortcut">${btn.shortcut}</span>`;
            button.onclick = () => insertPrompt(btn.key);
            toolbar.appendChild(button);
        });
        
        document.body.appendChild(toolbar);
        
        // Restore collapsed state
        if (localStorage.getItem('ebitda-toolbar-collapsed') === 'true') {
            toolbar.classList.add('collapsed');
        }
    }

    // Insert prompt into Claude's input
    function insertPrompt(key) {
        const prompt = PROMPTS[key];
        if (!prompt) return;
        
        // Try multiple selectors for different Claude UI versions
        const selectors = [
            'div[contenteditable="true"]',
            'textarea',
            '[data-placeholder]',
            '.ProseMirror',
            '[role="textbox"]'
        ];
        
        let inputField = null;
        for (const selector of selectors) {
            inputField = document.querySelector(selector);
            if (inputField) break;
        }
        
        if (inputField) {
            // Handle different input types
            if (inputField.tagName === 'TEXTAREA') {
                inputField.value = prompt;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
            } else if (inputField.contentEditable === 'true') {
                inputField.innerText = prompt;
                inputField.dispatchEvent(new Event('input', { bubbles: true }));
                
                // Trigger any React/Vue change events
                const event = new Event('input', { bubbles: true, cancelable: true });
                inputField.dispatchEvent(event);
            } else {
                // Try setting via React props (for React-based inputs)
                const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLTextAreaElement.prototype, 'value')?.set ||
                                              Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
                if (nativeInputValueSetter) {
                    nativeInputValueSetter.call(inputField, prompt);
                    inputField.dispatchEvent(new Event('input', { bubbles: true }));
                }
            }
            
            // Focus the field
            inputField.focus();
            
            // Show status
            showStatus(`✅ ${key.charAt(0).toUpperCase() + key.slice(1)} prompt inserted!`);
        } else {
            // Fallback: Copy to clipboard
            GM_setClipboard(prompt);
            showStatus(`📋 ${key.charAt(0).toUpperCase() + key.slice(1)} prompt copied to clipboard!`);
        }
    }

    // Show status message
    function showStatus(message) {
        let status = document.getElementById('ebitda-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'ebitda-status';
            document.body.appendChild(status);
        }
        
        status.textContent = message;
        status.classList.add('show');
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        if (!e.altKey) return;
        
        const shortcuts = {
            'i': 'init',
            'm': 'morning',
            'r': 'review',
            'o': 'optimize',
            'b': 'bug',
            't': 'test',
            'f': 'feature',
            'a': 'architect'
        };
        
        const key = e.key.toLowerCase();
        if (shortcuts[key]) {
            e.preventDefault();
            insertPrompt(shortcuts[key]);
        }
    });

    // Quick insert buttons near input field
    function addQuickButtons() {
        const observer = new MutationObserver(() => {
            const inputArea = document.querySelector('div[contenteditable="true"]')?.parentElement;
            if (inputArea && !document.getElementById('ebitda-quick-buttons')) {
                const quickBar = document.createElement('div');
                quickBar.id = 'ebitda-quick-buttons';
                quickBar.style.cssText = `
                    display: flex;
                    gap: 8px;
                    margin-bottom: 8px;
                    flex-wrap: wrap;
                `;
                
                ['Init', 'Review', 'Optimize', 'Debug'].forEach(cmd => {
                    const btn = document.createElement('button');
                    btn.textContent = cmd;
                    btn.style.cssText = `
                        padding: 4px 8px;
                        border-radius: 4px;
                        border: 1px solid #e2e8f0;
                        background: white;
                        font-size: 12px;
                        cursor: pointer;
                    `;
                    btn.onclick = () => insertPrompt(cmd.toLowerCase());
                    quickBar.appendChild(btn);
                });
                
                inputArea.parentElement.insertBefore(quickBar, inputArea);
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
    }

    // Initialize when page is ready
    function init() {
        createToolbar();
        addQuickButtons();
        console.log('🎮 EBITDA Claude Power Commands loaded! Use Alt+[I/M/R/O/B/T/F/A] for shortcuts.');
    }

    // Wait for page to load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        setTimeout(init, 500);
    }

})();