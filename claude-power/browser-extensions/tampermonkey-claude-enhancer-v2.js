// ==UserScript==
// @name         EBITDA Claude Power Commands V2
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Adds quick command buttons and shortcuts to Claude.ai for EBITDA development (Updated for new Claude UI)
// @author       EBITDA Developer
// @match        https://claude.ai/*
// @match        https://www.claude.ai/*
// @match        https://*.claude.ai/*
// @icon         https://claude.ai/favicon.ico
// @grant        GM_setClipboard
// @grant        GM_addStyle
// @grant        GM_notification
// @run-at       document-idle
// ==/UserScript==

(function() {
    'use strict';

    console.log('🎮 EBITDA Claude Power Commands V2 Loading...');

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
            z-index: 999999;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 12px;
            padding: 8px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1), 0 1px 3px rgba(0,0,0,0.08);
            display: flex;
            flex-direction: column;
            gap: 4px;
            transition: all 0.3s ease;
            max-height: 90vh;
            overflow-y: auto;
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
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
            z-index: 999999;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        }

        #ebitda-status.show {
            opacity: 1;
            transform: translateY(0);
        }

        #ebitda-status.error {
            background: #f56565;
        }

        .ebitda-shortcut {
            font-size: 10px;
            opacity: 0.7;
            margin-left: auto;
        }

        /* Debug panel */
        #ebitda-debug {
            position: fixed;
            bottom: 10px;
            left: 10px;
            background: rgba(0,0,0,0.8);
            color: #00ff00;
            padding: 10px;
            border-radius: 8px;
            font-family: monospace;
            font-size: 11px;
            max-width: 300px;
            z-index: 999999;
            display: none;
        }

        #ebitda-debug.show {
            display: block;
        }
    `);

    // Improved input field detection
    function findInputField() {
        // Try multiple strategies to find the input field
        const strategies = [
            // Strategy 1: ProseMirror editor (Claude's rich text editor)
            () => document.querySelector('.ProseMirror'),
            () => document.querySelector('[contenteditable="true"].ProseMirror'),
            
            // Strategy 2: Generic contenteditable
            () => document.querySelector('[contenteditable="true"]'),
            () => document.querySelector('div[contenteditable="true"]'),
            
            // Strategy 3: Textarea (fallback)
            () => document.querySelector('textarea'),
            
            // Strategy 4: Look for specific Claude classes
            () => document.querySelector('[data-testid="composer-input"]'),
            () => document.querySelector('[data-testid="message-input"]'),
            
            // Strategy 5: Look for aria labels
            () => document.querySelector('[aria-label*="message"]'),
            () => document.querySelector('[aria-label*="Message"]'),
            () => document.querySelector('[aria-label*="chat"]'),
            
            // Strategy 6: Look within specific containers
            () => {
                const composer = document.querySelector('[class*="composer"]');
                return composer ? composer.querySelector('[contenteditable="true"]') : null;
            },
            
            // Strategy 7: Find by placeholder
            () => document.querySelector('[data-placeholder*="Reply"]'),
            () => document.querySelector('[placeholder*="Reply"]'),
        ];

        for (const strategy of strategies) {
            try {
                const element = strategy();
                if (element) {
                    console.log('🎮 Found input using strategy:', strategies.indexOf(strategy));
                    return element;
                }
            } catch (e) {
                // Continue to next strategy
            }
        }
        
        console.log('🎮 No input field found');
        return null;
    }

    // Insert text into various types of input fields
    function insertTextIntoField(field, text) {
        if (!field) return false;

        try {
            // Method 1: For ProseMirror (Claude's editor)
            if (field.classList.contains('ProseMirror') || field.className.includes('ProseMirror')) {
                // Clear existing content
                field.innerHTML = '';
                
                // Create paragraph with text
                const p = document.createElement('p');
                p.textContent = text;
                field.appendChild(p);
                
                // Trigger input event
                field.dispatchEvent(new Event('input', { bubbles: true, cancelable: true }));
                
                // Focus
                field.focus();
                
                // Place cursor at end
                const selection = window.getSelection();
                const range = document.createRange();
                range.selectNodeContents(field);
                range.collapse(false);
                selection.removeAllRanges();
                selection.addRange(range);
                
                return true;
            }
            
            // Method 2: For contenteditable divs
            if (field.contentEditable === 'true') {
                field.textContent = text;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.focus();
                return true;
            }
            
            // Method 3: For textareas
            if (field.tagName === 'TEXTAREA') {
                field.value = text;
                field.dispatchEvent(new Event('input', { bubbles: true }));
                field.focus();
                return true;
            }
            
            return false;
        } catch (e) {
            console.error('🎮 Error inserting text:', e);
            return false;
        }
    }

    // Insert prompt into Claude's input
    function insertPrompt(key) {
        const prompt = PROMPTS[key];
        if (!prompt) {
            showStatus('❌ Unknown prompt: ' + key, true);
            return;
        }
        
        const inputField = findInputField();
        
        if (inputField && insertTextIntoField(inputField, prompt)) {
            showStatus(`✅ ${key.charAt(0).toUpperCase() + key.slice(1)} prompt inserted!`);
        } else {
            // Fallback: Copy to clipboard
            GM_setClipboard(prompt);
            showStatus(`📋 ${key.charAt(0).toUpperCase() + key.slice(1)} copied to clipboard! Press Ctrl+V to paste.`);
            
            // Also try to notify with system notification
            GM_notification({
                text: 'Prompt copied! Press Ctrl+V in Claude to paste.',
                title: 'EBITDA Claude Helper',
                timeout: 3000
            });
        }
    }

    // Show status message
    function showStatus(message, isError = false) {
        let status = document.getElementById('ebitda-status');
        if (!status) {
            status = document.createElement('div');
            status.id = 'ebitda-status';
            document.body.appendChild(status);
        }
        
        status.textContent = message;
        status.classList.add('show');
        if (isError) {
            status.classList.add('error');
        } else {
            status.classList.remove('error');
        }
        
        setTimeout(() => {
            status.classList.remove('show');
        }, 3000);
    }

    // Create toolbar
    function createToolbar() {
        // Remove existing toolbar if present
        const existing = document.getElementById('ebitda-toolbar');
        if (existing) existing.remove();
        
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
        
        // Add debug button (hidden by default)
        if (window.location.href.includes('debug=true')) {
            const debugBtn = document.createElement('button');
            debugBtn.className = 'ebitda-btn';
            debugBtn.innerHTML = '🔧 Debug';
            debugBtn.onclick = toggleDebug;
            toolbar.appendChild(debugBtn);
        }
        
        document.body.appendChild(toolbar);
        
        // Restore collapsed state
        if (localStorage.getItem('ebitda-toolbar-collapsed') === 'true') {
            toolbar.classList.add('collapsed');
        }
    }

    // Debug panel
    function toggleDebug() {
        let debug = document.getElementById('ebitda-debug');
        if (!debug) {
            debug = document.createElement('div');
            debug.id = 'ebitda-debug';
            document.body.appendChild(debug);
        }
        
        const inputField = findInputField();
        debug.innerHTML = `
            <strong>Debug Info:</strong><br>
            Input found: ${inputField ? 'YES' : 'NO'}<br>
            Input type: ${inputField ? inputField.tagName : 'N/A'}<br>
            Input class: ${inputField ? inputField.className : 'N/A'}<br>
            Editable: ${inputField ? inputField.contentEditable : 'N/A'}<br>
            URL: ${window.location.href}<br>
            Time: ${new Date().toLocaleTimeString()}
        `;
        
        debug.classList.toggle('show');
    }

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Check if Alt key is pressed (or Cmd on Mac)
        if (!e.altKey && !e.metaKey) return;
        
        // Don't trigger if user is already typing in input
        if (e.target.contentEditable === 'true' || e.target.tagName === 'TEXTAREA' || e.target.tagName === 'INPUT') {
            return;
        }
        
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
            e.stopPropagation();
            insertPrompt(shortcuts[key]);
        }
    });

    // Initialize when page is ready
    function init() {
        console.log('🎮 EBITDA Claude Power Commands initializing...');
        createToolbar();
        showStatus('🎮 EBITDA Tools Ready! Use Alt+[Letter] shortcuts', false);
        
        // Re-initialize on page changes (for SPAs)
        const observer = new MutationObserver((mutations) => {
            // Check if toolbar still exists
            if (!document.getElementById('ebitda-toolbar')) {
                createToolbar();
            }
        });
        
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });
    }

    // Wait for page to fully load
    if (document.readyState === 'complete' || document.readyState === 'interactive') {
        setTimeout(init, 1000);
    } else {
        window.addEventListener('DOMContentLoaded', () => setTimeout(init, 1000));
    }
    
    // Also init on load event as backup
    window.addEventListener('load', () => setTimeout(init, 1500));

})();