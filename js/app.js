// PureBlocks - Main Application Script

// DOM Elements
let runButton, exportButton, exampleSelector, themeSwitcher, toggleCodeButton, clearOutputButton;
let pythonCode, consoleOutput, visualOutput, blocklyDiv;
let mainResizer;

// Blockly workspace
let workspace;

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    // Get DOM elements
    runButton = document.getElementById('runButton');
    exportButton = document.getElementById('exportButton');
    exampleSelector = document.getElementById('exampleSelector');
    themeSwitcher = document.getElementById('themeSwitcher');
    toggleCodeButton = document.getElementById('toggleCode');
    clearOutputButton = document.getElementById('clearOutput');
    pythonCode = document.getElementById('pythonCode');
    consoleOutput = document.getElementById('consoleOutput');
    visualOutput = document.getElementById('visualOutput');
    blocklyDiv = document.getElementById('blocklyDiv');
    mainResizer = document.getElementById('mainResizer');
    
    // Initialize the application components
    initBlockly();
    setupEventListeners();
    setupResizablePanel();
    
    // Try to load previous workspace
    loadWorkspace();
    
    // Check for saved theme preference
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    
    // Set initial status
    document.querySelector('.status-bar').textContent = 'Ready';
});

// Initialize Blockly workspace
function initBlockly() {
    // Define the toolbox with categories
    const toolbox = {
        kind: 'categoryToolbox',
        contents: [
            {
                kind: 'category',
                name: 'Math',
                colour: '#FFD166',
                contents: [
                    { kind: 'block', type: 'math_is_prime' },
                    { kind: 'block', type: 'math_number' },
                    { kind: 'block', type: 'math_arithmetic' }
                ]
            },
            {
                kind: 'category',
                name: 'Drawing',
                colour: '#06D6A0',
                contents: [
                    // Basic drawing blocks
                    { kind: 'block', type: 'drawing_circle' },
                    { kind: 'block', type: 'drawing_rectangle' },
                    { kind: 'block', type: 'drawing_line' },
                    { kind: 'block', type: 'drawing_text' },
                    { kind: 'block', type: 'drawing_color' },
                    // New drawing blocks
                    { kind: 'block', type: 'drawing_fill_toggle' },
                    { kind: 'block', type: 'drawing_line_width' },
                    { kind: 'block', type: 'drawing_clear' },
                    { kind: 'block', type: 'drawing_polygon' },
                    { kind: 'block', type: 'drawing_arc' }
                ]
            },
            {
                kind: 'category',
                name: 'Variables',
                colour: '#EF476F',
                custom: 'VARIABLE'
            },
            {
                kind: 'category',
                name: 'Loops',
                colour: '#118AB2',
                contents: [
                    { kind: 'block', type: 'controls_repeat_ext' },
                    { kind: 'block', type: 'controls_for' },
                    { kind: 'block', type: 'controls_forEach' },
                    { kind: 'block', type: 'controls_whileUntil' }
                ]
            },
            {
                kind: 'category',
                name: 'Logic',
                colour: '#073B4C',
                contents: [
                    { kind: 'block', type: 'controls_if' },
                    { kind: 'block', type: 'logic_compare' },
                    { kind: 'block', type: 'logic_operation' },
                    { kind: 'block', type: 'logic_boolean' }
                ]
            },
            {
                kind: 'category',
                name: 'Functions',
                colour: '#06D6A0',
                custom: 'PROCEDURE'
            },
            {
                kind: 'category',
                name: 'Text',
                colour: '#8338EC',
                contents: [
                    { kind: 'block', type: 'text' },
                    { kind: 'block', type: 'text_print' },
                    { kind: 'block', type: 'text_join' }
                ]
            }
        ]
    };

    try {
        // Create Blockly workspace
        workspace = Blockly.inject(blocklyDiv, {
            toolbox: toolbox,
            grid: {
                spacing: 20,
                length: 1,
                colour: '#555',
                snap: true
            },
            zoom: {
                controls: true,
                wheel: true,
                startScale: 1.0,
                maxScale: 3,
                minScale: 0.3,
                scaleSpeed: 1.2
            },
            trashcan: true,
            media: 'https://unpkg.com/blockly/media/',
            horizontalLayout: false,
            scrollbars: true
        });

        // Apply custom theme 
        applyCustomTheme();

        // Add change listener to update code preview
        workspace.addChangeListener(updateCodePreview);
        
        // Fix size issue
        window.addEventListener('resize', function() {
            Blockly.svgResize(workspace);
        });
        
        // Fix initial size
        setTimeout(() => {
            Blockly.svgResize(workspace);
        }, 100);

        console.log("Blockly workspace initialized successfully");
    } catch (error) {
        console.error("Error initializing Blockly workspace:", error);
        consoleOutput.innerHTML += `<span style="color: red;">Error initializing workspace: ${error.message}</span>\n`;
    }
}

// Apply custom theme based on current light/dark setting
function applyCustomTheme() {
    // Get current theme
    const isDark = document.body.getAttribute('data-theme') === 'dark';
    
    // Create the theme
    const theme = Blockly.Theme.defineTheme('pureblocks', {
        'base': Blockly.Themes.Classic,
        'blockStyles': {
            'math_blocks': {
                'colourPrimary': '#FFD166',
                'colourSecondary': '#FFE599',
                'colourTertiary': '#FFD166'
            },
            'drawing_blocks': {
                'colourPrimary': '#06D6A0',
                'colourSecondary': '#A0FFE0',
                'colourTertiary': '#06D6A0'
            }
        },
        'componentStyles': {
            'workspaceBackgroundColour': isDark ? '#252525' : '#FFFFFF',
            'toolboxBackgroundColour': isDark ? '#333333' : '#F8F9FA',
            'toolboxForegroundColour': isDark ? '#F0F0F0' : '#333333',
            'flyoutBackgroundColour': isDark ? '#2D2D2D' : '#F8F9FA',
            'flyoutForegroundColour': isDark ? '#F0F0F0' : '#333333',
            'flyoutOpacity': 0.9,
            'scrollbarColour': isDark ? '#555555' : '#CCCCCC',
            'scrollbarOpacity': 0.5,
            'gridPattern': {
                'colour': isDark ? '#444' : '#ddd',
                'spacing': 25,
                'length': 1,
                'snap': true
            }
        }
    });
    
    if (workspace) {
        workspace.setTheme(theme);
    }
}

// Set up event listeners
function setupEventListeners() {
    // Run button
    runButton.addEventListener('click', () => {
        runCode();
    });

    // Export button
    exportButton.addEventListener('click', () => {
        showExportOptions();
    });

    // Example selector
    exampleSelector.addEventListener('change', () => {
        loadExample(exampleSelector.value);
    });

    // Theme switcher
    themeSwitcher.addEventListener('click', () => {
        const currentTheme = document.body.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        setTheme(newTheme);
    });

    // Toggle code button
    toggleCodeButton.addEventListener('click', () => {
        pythonCode.classList.toggle('hidden');
        toggleCodeButton.textContent = pythonCode.classList.contains('hidden') ? 'View Code' : 'Hide Code';
    });

    // Clear output button
    clearOutputButton.addEventListener('click', () => {
        clearOutput();
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl+Enter to run code
        if (e.ctrlKey && e.key === 'Enter') {
            runCode();
        }
        // Ctrl+S to export
        if (e.ctrlKey && e.key === 's') {
            e.preventDefault();
            showExportOptions();
        }
    });
    
    // Autosave on changes
    if (workspace) {
        workspace.addChangeListener(() => {
            saveWorkspace();
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', () => {
        if (workspace) {
            Blockly.svgResize(workspace);
        }
    });
}

// Setup resizable panel
function setupResizablePanel() {
    const blockToolbox = document.getElementById('blocklyArea');
    const outputPanel = document.getElementById('outputPanel');
    
    let isResizing = false;
    let lastX = 0;
    
    // Main resizer
    mainResizer.addEventListener('mousedown', (e) => {
        isResizing = true;
        lastX = e.clientX;
        document.body.style.cursor = 'col-resize';
        e.preventDefault();
    });
    
    // Mouse move handler
    document.addEventListener('mousemove', (e) => {
        if (!isResizing) return;
        
        const deltaX = e.clientX - lastX;
        lastX = e.clientX;
        
        // Calculate new width as a percentage
        const containerWidth = document.querySelector('main').offsetWidth;
        let newBlockToolboxWidth = blockToolbox.offsetWidth + deltaX;
        let newBlockToolboxPercent = (newBlockToolboxWidth / containerWidth) * 100;
        
        // Limit to reasonable values
        if (newBlockToolboxPercent > 20 && newBlockToolboxPercent < 80) {
            blockToolbox.style.width = `${newBlockToolboxPercent}%`;
            outputPanel.style.width = `${100 - newBlockToolboxPercent}%`;
            
            // Resize Blockly workspace
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }
        
        e.preventDefault();
    });
    
    // Mouse up handler
    document.addEventListener('mouseup', () => {
        if (isResizing) {
            isResizing = false;
            document.body.style.cursor = '';
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }
    });
}

// Update the code preview with generated Python code
function updateCodePreview() {
    try {
        if (workspace && Blockly.Python) {
            const code = Blockly.Python.workspaceToCode(workspace);
            pythonCode.textContent = code || '# No code generated - add blocks to workspace';
        }
    } catch (error) {
        console.error("Error updating code preview:", error);
        pythonCode.textContent = `# Error generating code: ${error.message}`;
    }
}

// Run the code from blocks
function runCode() {
    clearOutput();
    
    if (!workspace) {
        consoleOutput.innerHTML += `<span style="color: red;">Workspace not initialized. Please refresh the page.</span>\n`;
        return;
    }
    
    try {
        const code = Blockly.Python.workspaceToCode(workspace);
        
        if (!code.trim()) {
            consoleOutput.innerHTML += "No code to run. Add some blocks to the workspace.\n";
            return;
        }
        
        // Update status
        document.querySelector('.status-bar').textContent = 'Running...';
        
        // Execute the code using the interpreter
        executeCode(code);
        document.querySelector('.status-bar').textContent = 'Completed';
    } catch (error) {
        console.error("Error running code:", error);
        consoleOutput.innerHTML += `<span style="color: red;">Error: ${error.message}</span>\n`;
        document.querySelector('.status-bar').textContent = 'Error';
    }
}

// Clear the output panels
function clearOutput() {
    consoleOutput.innerHTML = '';
    visualOutput.innerHTML = '';
}

// Set theme (light/dark)
function setTheme(theme) {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
    themeSwitcher.textContent = theme === 'dark' ? '☀️' : '🌙';
    
    // Update blockly theme
    applyCustomTheme();
    
    // Force a redraw of the workspace
    if (workspace) {
        Blockly.svgResize(workspace);
    }
}

// Show export options modal
function showExportOptions() {
    // For now, just export as HTML
    exportAsHTML();
}

// Export project as standalone HTML
function exportAsHTML() {
    let xmlText = '';
    try {
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            xmlText = Blockly.Xml.domToText(xml);
        }
    } catch (e) {
        console.error("Error serializing workspace to XML:", e);
        xmlText = '<!-- Error serializing workspace -->';
    }
    const code = workspace ? Blockly.Python.workspaceToCode(workspace) : '';
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>PureBlocks Export</title>
    <style>
        body { font-family: 'Inter', sans-serif; padding: 20px; max-width: 800px; margin: 0 auto; }
        pre { background: #f5f5f5; padding: 15px; border-radius: 5px; overflow-x: auto; }
        .output { margin-top: 20px; border-top: 1px solid #eee; padding-top: 20px; }
        canvas { max-width: 100%; border: 1px solid #ddd; }
    </style>
</head>
<body>
    <h1>PureBlocks Export</h1>
    <h2>Python Code:</h2>
    <pre>${escapeHTML(code)}</pre>
    <div class="output">
        <h2>Output:</h2>
        <div id="outputContainer">
            ${consoleOutput.innerHTML}
        </div>
        <div id="visualContainer">
            ${visualOutput.innerHTML}
        </div>
    </div>
    <!-- Blocks XML (for debugging) -->
    <div style="display: none;" id="blocklyXml">${escapeHTML(xmlText)}</div>
</body>
</html>`;

    // Create download link
    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pureblocks_export.html';
    a.click();
    URL.revokeObjectURL(url);
}

// Escape HTML special characters
function escapeHTML(text) {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

// Load example
function loadExample(example) {
    if (!example) return;
    
    clearWorkspace();
    
    // Load the selected example
    try {
        let xmlText = '';
        switch (example) {
            case 'fibonacci':
                xmlText = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variables_set" id="fibonacci_init" x="50" y="50"><field name="VAR" id="a">a</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value><next><block type="variables_set" id="fibonacci_init2"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="controls_for" id="fibonacci_loop"><field name="VAR" id="i">i</field><value name="FROM"><block type="math_number"><field name="NUM">0</field></block></value><value name="TO"><block type="math_number"><field name="NUM">10</field></block></value><value name="BY"><block type="math_number"><field name="NUM">1</field></block></value><statement name="DO"><block type="text_print"><value name="TEXT"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><next><block type="variables_set" id="fibonacci_calc"><field name="VAR" id="temp">temp</field><value name="VALUE"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><next><block type="variables_set"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="B"><block type="variables_get"><field name="VAR" id="b">b</field></block></value></block></value><next><block type="variables_set"><field name="VAR" id="a">a</field><value name="VALUE"><block type="variables_get"><field name="VAR" id="temp">temp</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>';
                break;
            case 'pythagorean':
                xmlText = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variables_set" id="pythagorean_a" x="50" y="50"><field name="VAR" id="a">a</field><value name="VALUE"><block type="math_number"><field name="NUM">3</field></block></value><next><block type="variables_set" id="pythagorean_b"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_number"><field name="NUM">4</field></block></value><next><block type="variables_set" id="pythagorean_c"><field name="VAR" id="c">c</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="B"><block type="math_number"><field name="NUM">2</field></block></value></block></value><value name="B"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><value name="B"><block type="math_number"><field name="NUM">2</field></block></value></block></value></block></value><value name="B"><block type="math_number"><field name="NUM">0.5</field></block></value></block></value><next><block type="text_print"><value name="TEXT"><block type="text_join"><mutation items="7"></mutation><value name="ADD0"><block type="text"><field name="TEXT">a² + b² = c²: </field></block></value><value name="ADD1"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="ADD2"><block type="text"><field name="TEXT">² + </field></block></value><value name="ADD3"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><value name="ADD4"><block type="text"><field name="TEXT">² = </field></block></value><value name="ADD5"><block type="variables_get"><field name="VAR" id="c">c</field></block></value><value name="ADD6"><block type="text"><field name="TEXT">²</field></block></value></block></value></block></next></block></next></block></next></block></xml>';
                break;
            case 'drawing':
                xmlText = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="drawing_color" x="20" y="20">
    <field name="COLOR">#ff0000</field>
    <next>
      <block type="drawing_circle">
        <value name="X">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <value name="Y">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <value name="RADIUS">
          <block type="math_number">
            <field name="NUM">50</field>
          </block>
        </value>
        <next>
          <block type="drawing_color">
            <field name="COLOR">#0000ff</field>
            <next>
              <block type="drawing_rectangle">
                <value name="X">
                  <block type="math_number">
                    <field name="NUM">200</field>
                  </block>
                </value>
                <value name="Y">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
                <value name="WIDTH">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
                <value name="HEIGHT">
                  <block type="math_number">
                    <field name="NUM">80</field>
                  </block>
                </value>
                <next>
                  <block type="drawing_color">
                    <field name="COLOR">#00ff00</field>
                    <next>
                      <block type="drawing_line">
                        <value name="X1">
                          <block type="math_number">
                            <field name="NUM">50</field>
                          </block>
                        </value>
                        <value name="Y1">
                          <block type="math_number">
                            <field name="NUM">200</field>
                          </block>
                        </value>
                        <value name="X2">
                          <block type="math_number">
                            <field name="NUM">250</field>
                          </block>
                        </value>
                        <value name="Y2">
                          <block type="math_number">
                            <field name="NUM">200</field>
                          </block>
                        </value>
                        <next>
                          <block type="drawing_text">
                            <value name="X">
                              <block type="math_number">
                                <field name="NUM">150</field>
                              </block>
                            </value>
                            <value name="Y">
                              <block type="math_number">
                                <field name="NUM">50</field>
                              </block>
                            </value>
                            <value name="TEXT">
                              <block type="text">
                                <field name="TEXT">Drawing Example</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;
                break;
        }
        
        if (workspace && xmlText) {
            const dom = Blockly.utils.xml.textToDom(xmlText);
            Blockly.Xml.domToWorkspace(dom, workspace);
        }
        
        // Force a resize to make sure the workspace updates correctly
        setTimeout(() => {
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }, 100);
    } catch (error) {
        console.error(`Error loading example (${example}):`, error);
        consoleOutput.innerHTML += `<span style="color: red;">Error loading example: ${error.message}</span>\n`;
    }
    
    // Reset selector
    exampleSelector.value = '';
}

// Clear the workspace
function clearWorkspace() {
    if (workspace) {
        workspace.clear();
    }
}

// Load Fibonacci example
function loadFibonacciExample() {
    if (!workspace) return;
    try {
        const xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variables_set" id="fibonacci_init" x="50" y="50"><field name="VAR" id="a">a</field><value name="VALUE"><block type="math_number"><field name="NUM">0</field></block></value><next><block type="variables_set" id="fibonacci_init2"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_number"><field name="NUM">1</field></block></value><next><block type="controls_for" id="fibonacci_loop"><field name="VAR" id="i">i</field><value name="FROM"><block type="math_number"><field name="NUM">0</field></block></value><value name="TO"><block type="math_number"><field name="NUM">10</field></block></value><value name="BY"><block type="math_number"><field name="NUM">1</field></block></value><statement name="DO"><block type="text_print"><value name="TEXT"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><next><block type="variables_set" id="fibonacci_calc"><field name="VAR" id="temp">temp</field><value name="VALUE"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><next><block type="variables_set"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="B"><block type="variables_get"><field name="VAR" id="b">b</field></block></value></block></value><next><block type="variables_set"><field name="VAR" id="a">a</field><value name="VALUE"><block type="variables_get"><field name="VAR" id="temp">temp</field></block></value></block></next></block></next></block></next></block></statement></block></next></block></next></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (error) {
        console.error("Error loading Fibonacci example:", error);
        consoleOutput.innerHTML += `<span style="color: red;">Error loading example: ${error.message}</span>\n`;
    }
}

// Load Pythagorean example
function loadPythagoreanExample() {
    if (!workspace) return;
    try {
        const xml = '<xml xmlns="https://developers.google.com/blockly/xml"><block type="variables_set" id="pythagorean_a" x="50" y="50"><field name="VAR" id="a">a</field><value name="VALUE"><block type="math_number"><field name="NUM">3</field></block></value><next><block type="variables_set" id="pythagorean_b"><field name="VAR" id="b">b</field><value name="VALUE"><block type="math_number"><field name="NUM">4</field></block></value><next><block type="variables_set" id="pythagorean_c"><field name="VAR" id="c">c</field><value name="VALUE"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="math_arithmetic"><field name="OP">ADD</field><value name="A"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="B"><block type="math_number"><field name="NUM">2</field></block></value></block></value><value name="B"><block type="math_arithmetic"><field name="OP">POWER</field><value name="A"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><value name="B"><block type="math_number"><field name="NUM">2</field></block></value></block></value></block></value><value name="B"><block type="math_number"><field name="NUM">0.5</field></block></value></block></value><next><block type="text_print"><value name="TEXT"><block type="text_join"><mutation items="7"></mutation><value name="ADD0"><block type="text"><field name="TEXT">a² + b² = c²: </field></block></value><value name="ADD1"><block type="variables_get"><field name="VAR" id="a">a</field></block></value><value name="ADD2"><block type="text"><field name="TEXT">² + </field></block></value><value name="ADD3"><block type="variables_get"><field name="VAR" id="b">b</field></block></value><value name="ADD4"><block type="text"><field name="TEXT">² = </field></block></value><value name="ADD5"><block type="variables_get"><field name="VAR" id="c">c</field></block></value><value name="ADD6"><block type="text"><field name="TEXT">²</field></block></value></block></value></block></next></block></next></block></next></block></xml>';
        Blockly.Xml.domToWorkspace(Blockly.Xml.textToDom(xml), workspace);
    } catch (error) {
        console.error("Error loading Pythagorean example:", error);
        consoleOutput.innerHTML += `<span style="color: red;">Error loading example: ${error.message}</span>\n`;
    }
}

// Load drawing example
function loadDrawingExample() {
    if (!workspace) return;
    try {
        // Simplified XML definition that's properly formatted
        const xml = `
<xml xmlns="https://developers.google.com/blockly/xml">
  <block type="drawing_color" x="20" y="20">
    <field name="COLOR">#ff0000</field>
    <next>
      <block type="drawing_circle">
        <value name="X">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <value name="Y">
          <block type="math_number">
            <field name="NUM">100</field>
          </block>
        </value>
        <value name="RADIUS">
          <block type="math_number">
            <field name="NUM">50</field>
          </block>
        </value>
        <next>
          <block type="drawing_color">
            <field name="COLOR">#0000ff</field>
            <next>
              <block type="drawing_rectangle">
                <value name="X">
                  <block type="math_number">
                    <field name="NUM">200</field>
                  </block>
                </value>
                <value name="Y">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
                <value name="WIDTH">
                  <block type="math_number">
                    <field name="NUM">100</field>
                  </block>
                </value>
                <value name="HEIGHT">
                  <block type="math_number">
                    <field name="NUM">80</field>
                  </block>
                </value>
                <next>
                  <block type="drawing_color">
                    <field name="COLOR">#00ff00</field>
                    <next>
                      <block type="drawing_line">
                        <value name="X1">
                          <block type="math_number">
                            <field name="NUM">50</field>
                          </block>
                        </value>
                        <value name="Y1">
                          <block type="math_number">
                            <field name="NUM">200</field>
                          </block>
                        </value>
                        <value name="X2">
                          <block type="math_number">
                            <field name="NUM">250</field>
                          </block>
                        </value>
                        <value name="Y2">
                          <block type="math_number">
                            <field name="NUM">200</field>
                          </block>
                        </value>
                        <next>
                          <block type="drawing_text">
                            <value name="X">
                              <block type="math_number">
                                <field name="NUM">150</field>
                              </block>
                            </value>
                            <value name="Y">
                              <block type="math_number">
                                <field name="NUM">50</field>
                              </block>
                            </value>
                            <value name="TEXT">
                              <block type="text">
                                <field name="TEXT">Drawing Example</field>
                              </block>
                            </value>
                          </block>
                        </next>
                      </block>
                    </next>
                  </block>
                </next>
              </block>
            </next>
          </block>
        </next>
      </block>
    </next>
  </block>
</xml>`;
        
        const dom = Blockly.Xml.textToDom(xml);
        Blockly.Xml.domToWorkspace(dom, workspace);
        
        // Force a resize to make sure the workspace updates correctly
        setTimeout(() => {
            if (workspace) {
                Blockly.svgResize(workspace);
            }
        }, 100);
    } catch (error) {
        console.error("Error loading Drawing example:", error);
        consoleOutput.innerHTML += `<span style="color: red;">Error loading example: ${error.message}</span>\n`;
    }
}

// Save workspace to localStorage
function saveWorkspace() {
    try {
        if (workspace) {
            const xml = Blockly.Xml.workspaceToDom(workspace);
            const xmlText = Blockly.Xml.domToText(xml);
            localStorage.setItem('pureblocks_workspace', xmlText);
        }
    } catch (error) {
        console.error("Error saving workspace:", error);
    }
}

// Load workspace from localStorage
function loadWorkspace() {
    try {
        if (workspace) {
            const xmlText = localStorage.getItem('pureblocks_workspace');
            if (xmlText) {
                clearWorkspace();
                const dom = Blockly.utils.xml.textToDom(xmlText);
                Blockly.Xml.domToWorkspace(dom, workspace);
            }
        }
    } catch (error) {
        console.error("Error loading workspace from localStorage:", error);
        // Optionally clear corrupted data
        // localStorage.removeItem('pureblocks_workspace');
    }
} 