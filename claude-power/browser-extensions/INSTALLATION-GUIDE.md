# Browser Extension Installation Guide

## 🎯 Option 1: Tampermonkey (Recommended - Works on All Browsers)

### Step 1: Install Tampermonkey Extension

#### Chrome/Edge:
1. Go to Chrome Web Store: https://chrome.google.com/webstore/detail/tampermonkey/dhdgffkkebhmkfjojejmpbldmpobfkfo
2. Click "Add to Chrome" or "Add to Edge"
3. Click "Add Extension" when prompted

#### Firefox:
1. Go to Firefox Add-ons: https://addons.mozilla.org/en-US/firefox/addon/tampermonkey/
2. Click "Add to Firefox"
3. Click "Add" when prompted

#### Safari:
1. Go to App Store: https://apps.apple.com/us/app/tampermonkey/id1482490089
2. Install Tampermonkey
3. Enable in Safari Preferences > Extensions

### Step 2: Install the EBITDA Claude Script

1. **Click the Tampermonkey icon** in your browser toolbar (looks like a black square with two circles)

2. **Select "Create a new script..."**

3. **DELETE all the default code** that appears

4. **Copy ALL the code** from this file:
   ```
   C:\Users\wilso\Downloads\EBITDA\claude-power\browser-extensions\tampermonkey-claude-enhancer.js
   ```

5. **Paste it** into the Tampermonkey editor

6. **Press Ctrl+S** (or Cmd+S on Mac) to save

7. The script name should automatically be "EBITDA Claude Power Commands"

### Step 3: Verify Installation

1. Go to https://claude.ai
2. You should see a **purple toolbar** in the top-right corner with a 🎮 icon
3. Click the 🎮 to expand/collapse the toolbar
4. You should see buttons like:
   - 🚀 Init EBITDA
   - 📅 Morning
   - 🔍 Review
   - ⚡ Optimize
   - 🐛 Debug
   - 🧪 Test
   - ✨ Feature
   - 🏗️ Architect

### Step 4: Using the Extension

#### Method 1: Click Buttons
- Click any button to insert that template into Claude's input field
- The prompt will appear automatically

#### Method 2: Keyboard Shortcuts
- **Alt+I** → Init EBITDA system prompt
- **Alt+M** → Morning standup template
- **Alt+R** → Code review template
- **Alt+O** → Optimize code prompt
- **Alt+B** → Bug investigation
- **Alt+T** → Test generation
- **Alt+F** → Feature planning
- **Alt+A** → Architecture design

#### Method 3: Quick Buttons
Small buttons appear above Claude's input field for quick access

---

## 🚀 Option 2: Chrome Snippets (Chrome/Edge Only)

### Step 1: Open DevTools
1. Go to https://claude.ai
2. Press **F12** or **Right-click → Inspect**
3. Go to **Sources** tab
4. Look for **Snippets** in the left panel (might be under >>)
5. If you don't see it, click the **>>** arrows to show more panels

### Step 2: Create Snippets

1. Right-click in the Snippets area
2. Select **"New"**
3. Name it: `EBITDA Init`
4. Paste this code:

```javascript
// EBITDA System Prompt Inserter
(() => {
    const prompt = `You are EBITDA-Claude, a specialized AI assistant for developing a private equity simulation game.

## Core Context
- Project: Private Equity firm simulation game (EBITDA)
- Tech Stack: TypeScript/React, Rust WASM, Go backend
- Performance: 60 FPS, 10,000+ AI entities
- Constraint: Deterministic simulation

Acknowledge with: "EBITDA-Claude initialized."`;

    // Find input field
    const input = document.querySelector('div[contenteditable="true"]') || 
                  document.querySelector('textarea');
    
    if (input) {
        if (input.tagName === 'TEXTAREA') {
            input.value = prompt;
        } else {
            input.innerText = prompt;
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
        console.log('✅ EBITDA prompt inserted!');
    } else {
        console.log('❌ Could not find input field');
        // Copy to clipboard as fallback
        navigator.clipboard.writeText(prompt);
        console.log('📋 Copied to clipboard instead');
    }
})();
```

5. Press **Ctrl+S** to save

### Step 3: Create More Snippets

Repeat Step 2 for these snippets:

#### Snippet: "EBITDA Review"
```javascript
// Code Review Template
(() => {
    const prompt = `Review this EBITDA game code for:
- Performance (must maintain 60 FPS)
- Memory leaks
- Determinism issues
- Best practices

\`\`\`typescript
// PASTE CODE HERE
\`\`\``;
    
    const input = document.querySelector('div[contenteditable="true"]') || 
                  document.querySelector('textarea');
    if (input) {
        input.tagName === 'TEXTAREA' ? input.value = prompt : input.innerText = prompt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
    }
})();
```

#### Snippet: "EBITDA Optimize"
```javascript
// Optimization Request
(() => {
    const prompt = `Optimize this EBITDA game code for performance while maintaining determinism and 60 FPS:

\`\`\`typescript
// PASTE CODE HERE
\`\`\``;
    
    const input = document.querySelector('div[contenteditable="true"]') || 
                  document.querySelector('textarea');
    if (input) {
        input.tagName === 'TEXTAREA' ? input.value = prompt : input.innerText = prompt;
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.focus();
    }
})();
```

### Step 4: Running Snippets

1. Open DevTools (F12) on Claude.ai
2. Go to Sources → Snippets
3. Right-click your snippet
4. Select **"Run"** or press **Ctrl+Enter**

**Pro Tip**: You can also right-click → "Run" without opening the snippet

---

## 🎨 Option 3: Bookmarklets (Simplest, All Browsers)

### Step 1: Show Bookmarks Bar
- **Chrome/Edge**: Ctrl+Shift+B
- **Firefox**: Ctrl+B
- **Safari**: View → Show Bookmarks Bar

### Step 2: Create Bookmarklets

1. Right-click on your bookmarks bar
2. Select "Add Page" or "Add Bookmark"
3. Set the name and URL as below:

#### Bookmarklet 1: "🚀 EBITDA Init"
**URL**:
```javascript
javascript:(function(){const p=`You are EBITDA-Claude, specialized in PE game development. Tech: TypeScript/React, Rust WASM. Requirements: 60 FPS, deterministic. Acknowledge with: "EBITDA-Claude initialized."`;const i=document.querySelector('div[contenteditable="true"]')||document.querySelector('textarea');if(i){i.tagName==='TEXTAREA'?i.value=p:i.innerText=p;i.dispatchEvent(new Event('input',{bubbles:true}));i.focus();}else{navigator.clipboard.writeText(p);alert('Prompt copied to clipboard!');}})();
```

#### Bookmarklet 2: "🔍 Review"
**URL**:
```javascript
javascript:(function(){const p=`Review this EBITDA game code for performance, memory leaks, and determinism:\n\n\`\`\`typescript\n// PASTE CODE HERE\n\`\`\``;const i=document.querySelector('div[contenteditable="true"]')||document.querySelector('textarea');if(i){i.tagName==='TEXTAREA'?i.value=p:i.innerText=p;i.dispatchEvent(new Event('input',{bubbles:true}));i.focus();}})();
```

#### Bookmarklet 3: "⚡ Optimize"
**URL**:
```javascript
javascript:(function(){const p=`Optimize for 60 FPS while maintaining determinism:\n\n\`\`\`typescript\n// PASTE CODE HERE\n\`\`\``;const i=document.querySelector('div[contenteditable="true"]')||document.querySelector('textarea');if(i){i.tagName==='TEXTAREA'?i.value=p:i.innerText=p;i.dispatchEvent(new Event('input',{bubbles:true}));i.focus();}})();
```

### Step 3: Using Bookmarklets

1. Go to https://claude.ai
2. Click any bookmarklet in your bookmarks bar
3. The prompt appears in Claude's input field instantly!

---

## ✅ Testing Your Setup

### Test 1: Tampermonkey
1. Go to claude.ai
2. Look for purple toolbar (top-right)
3. Click "🚀 Init EBITDA"
4. Text should appear in input field

### Test 2: Keyboard Shortcuts (Tampermonkey)
1. On claude.ai
2. Press **Alt+I**
3. Init prompt should appear

### Test 3: Bookmarklets
1. Click your bookmarklet
2. Prompt should appear or copy to clipboard

---

## 🔧 Troubleshooting

### Toolbar Not Appearing
1. Check Tampermonkey is enabled (icon should be colored, not gray)
2. Refresh Claude.ai
3. Check the script is enabled in Tampermonkey dashboard

### Shortcuts Not Working
1. Make sure Claude.ai tab is focused
2. Try clicking in the page first
3. Some browsers require Alt+Shift instead of just Alt

### Text Not Inserting
1. Click in Claude's input area first
2. Try the clipboard fallback (you'll see a message)
3. Manually paste with Ctrl+V

### Chrome DevTools Snippets Missing
1. Click the >> arrows to show hidden panels
2. Right-click tabs and select "Snippets"
3. May need to enable in Settings → Experiments

---

## 🎯 Quick Reference

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| **Tampermonkey** | Full features, shortcuts, auto-loads | Requires extension | Power users |
| **Chrome Snippets** | No extension needed | Manual run each time | Developers |
| **Bookmarklets** | Simplest, works everywhere | Limited features | Quick access |

---

## 📚 Next Steps

1. **Install Tampermonkey** (recommended)
2. **Add the script**
3. **Test on Claude.ai**
4. **Use keyboard shortcuts** for speed
5. **Customize prompts** in the script if needed

You're now ready to supercharge your Claude interactions for EBITDA development! 🚀