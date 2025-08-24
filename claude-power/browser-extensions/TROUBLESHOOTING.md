# Troubleshooting Guide for Claude Extensions

## 🔧 Common Issues and Solutions

### Issue 1: Toolbar Not Appearing

**Symptoms:**
- No purple toolbar on Claude.ai
- Tampermonkey is installed but nothing shows

**Solutions:**

1. **Check Tampermonkey is enabled:**
   - Click Tampermonkey icon in browser
   - Make sure it's not grayed out
   - Dashboard should show script as "Enabled"

2. **Verify script is installed:**
   - Click Tampermonkey icon → Dashboard
   - Should see "EBITDA Claude Power Commands V2"
   - Status should be ✓ Enabled

3. **Check URL match:**
   - Make sure you're on https://claude.ai
   - Not on a subdomain like app.claude.ai
   - Script works on: claude.ai/* 

4. **Force refresh:**
   - Press Ctrl+F5 (hard refresh)
   - Or Ctrl+Shift+R

5. **Try V2 script:**
   - Use the updated `tampermonkey-claude-enhancer-v2.js`
   - Has better compatibility

### Issue 2: Text Not Inserting

**Symptoms:**
- Clicking buttons doesn't insert text
- Getting "copied to clipboard" instead

**Solutions:**

1. **Click in Claude's input area first:**
   - Click where you normally type
   - Then try the button

2. **Use clipboard fallback:**
   - If you see "📋 Copied to clipboard"
   - Press Ctrl+V to paste

3. **Check for Claude UI updates:**
   - Claude may have changed their interface
   - Try the V2 script which has multiple detection methods

4. **Enable debug mode:**
   - Add `?debug=true` to URL: `https://claude.ai?debug=true`
   - Look for debug panel (bottom-left)
   - Shows if input field is detected

### Issue 3: Keyboard Shortcuts Not Working

**Symptoms:**
- Alt+I, Alt+R etc. don't work
- Nothing happens when pressing shortcuts

**Solutions:**

1. **Check focus:**
   - Click somewhere on the Claude page (not in input)
   - Try shortcut again

2. **Try with Cmd (Mac) or Windows key:**
   - Mac: Cmd+I instead of Alt+I
   - Windows: Try Windows+I

3. **Check for conflicts:**
   - Other extensions might use same shortcuts
   - Try disabling other extensions temporarily

4. **Browser-specific issues:**
   - Chrome/Edge: Should work with Alt
   - Firefox: Might need Alt+Shift
   - Safari: Try Cmd instead

### Issue 4: Script Not Running At All

**Symptoms:**
- No console messages
- Nothing appears
- Tampermonkey shows script as running but nothing happens

**Solutions:**

1. **Check console for errors:**
   - Press F12 → Console tab
   - Look for red errors
   - Should see "🎮 EBITDA Claude Power Commands Loading..."

2. **Reinstall script:**
   - Delete old version in Tampermonkey
   - Install fresh copy of V2

3. **Check Tampermonkey permissions:**
   - Tampermonkey → Dashboard → Settings
   - Make sure "Inject scripts" is enabled

4. **Try different browser:**
   - Chrome/Edge usually work best
   - Firefox needs additional permissions sometimes

### Issue 5: Bookmarklets Not Working

**Symptoms:**
- Clicking bookmarklet does nothing
- Error messages appear

**Solutions:**

1. **Make sure you're on Claude.ai first:**
   - Navigate to claude.ai
   - Then click bookmarklet

2. **Check bookmarklet was saved correctly:**
   - Right-click bookmarklet → Edit
   - Make sure it starts with `javascript:`
   - No spaces before `javascript:`

3. **Try the HTML file method:**
   - Open `bookmarklets.html` in browser
   - Drag fresh copies to bookmarks bar

4. **Browser security:**
   - Some browsers block javascript: URLs
   - Try Chrome or Edge

## 🔍 Diagnostic Steps

### Step 1: Verify Installation
```javascript
// Run in console (F12) on claude.ai
console.log('Tampermonkey installed:', typeof GM_info !== 'undefined');
console.log('Script running:', document.getElementById('ebitda-toolbar') !== null);
```

### Step 2: Test Input Detection
```javascript
// Run in console to test input detection
const inputs = [
    document.querySelector('.ProseMirror'),
    document.querySelector('[contenteditable="true"]'),
    document.querySelector('textarea')
];
console.log('Input fields found:', inputs.filter(Boolean).length);
```

### Step 3: Manual Insert Test
```javascript
// Try inserting text manually
const field = document.querySelector('[contenteditable="true"]');
if (field) {
    field.textContent = 'Test message';
    field.dispatchEvent(new Event('input', {bubbles: true}));
    console.log('Text inserted!');
} else {
    console.log('No field found');
}
```

## 🚀 Quick Fixes

### Fix 1: Complete Reinstall
1. Remove script from Tampermonkey
2. Clear browser cache (Ctrl+Shift+Delete)
3. Install V2 script fresh
4. Restart browser

### Fix 2: Use Console Commands
If nothing else works, use console:
```javascript
// Paste in console to insert EBITDA prompt
navigator.clipboard.writeText(`You are EBITDA-Claude, specialized in PE game development.`);
console.log('Prompt copied! Press Ctrl+V in Claude');
```

### Fix 3: Simple Copy Button
Create a simple bookmarklet that just copies:
```javascript
javascript:navigator.clipboard.writeText('You are EBITDA-Claude, specialized in PE game development. Tech: TypeScript/React, Rust WASM. Requirements: 60 FPS, deterministic. Acknowledge with: "EBITDA-Claude initialized."');alert('Copied! Paste in Claude with Ctrl+V');
```

## 📞 Still Having Issues?

### Information to Gather:
1. Browser name and version
2. Tampermonkey version
3. Console errors (F12 → Console)
4. Screenshot of Claude.ai page
5. Which script version (V1 or V2)

### Test Sequence:
1. Install V2 script
2. Go to claude.ai
3. Wait 3 seconds
4. Press F12 → Console
5. Look for "🎮 EBITDA" messages
6. Try clicking a button
7. Check console for errors

### Last Resort:
- Use the bookmarklets.html file
- These are simpler and more reliable
- Just copy/paste functionality

## ✅ Working Confirmation

You should see:
1. Purple toolbar (top-right)
2. Console message: "🎮 EBITDA Claude Power Commands initializing..."
3. Green notification: "🎮 EBITDA Tools Ready!"
4. Buttons respond to clicks
5. Shortcuts work with Alt+[Letter]

If you see all of these, the extension is working correctly!