// PureBlocks - Code Interpreter

// Variables for the drawing canvas
let drawingCanvas, drawingContext, currentDrawingColor = '#ff0000';
let fillMode = true;
let lineWidth = 2;

// Execute the generated Python-like code
function executeCode(code) {
    try {
        // Clear previous output
        clearVisualOutput();
        
        // Create drawing canvas if not exists
        createDrawingCanvas();
        
        // Add line to indicate code execution started
        addToConsole("Executing code...");
        
        // Execute the code
        interpretPythonLike(code);
        
        addToConsole("Code execution completed.");
    } catch (error) {
        console.error("Error executing code:", error);
        addToConsole(`<span style="color: red;">Error: ${error.message}</span>`);
    }
}

// Create drawing canvas for visual output
function createDrawingCanvas() {
    // Clear existing visual output
    const visualOutput = document.getElementById('visualOutput');
    visualOutput.innerHTML = '';
    
    // Create a container for the canvas and button
    const canvasContainer = document.createElement('div');
    canvasContainer.className = 'canvas-container';
    canvasContainer.style.position = 'relative';
    canvasContainer.style.display = 'flex';
    canvasContainer.style.flexDirection = 'column';
    canvasContainer.style.alignItems = 'center';
    visualOutput.appendChild(canvasContainer);
    
    // Create canvas element
    drawingCanvas = document.createElement('canvas');
    drawingCanvas.width = 400;
    drawingCanvas.height = 300;
    drawingCanvas.style.border = '1px solid #ddd';
    drawingCanvas.style.backgroundColor = '#fff';
    
    // Get drawing context
    drawingContext = drawingCanvas.getContext('2d');
    
    // Set initial state
    drawingContext.fillStyle = '#ffffff';
    drawingContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingContext.fillStyle = currentDrawingColor;
    drawingContext.strokeStyle = currentDrawingColor;
    drawingContext.lineWidth = lineWidth;
    drawingContext.font = '16px Arial';
    
    // Add canvas to container
    canvasContainer.appendChild(drawingCanvas);
    
    // Add download button directly to container (no separate button container)
    const downloadBtn = document.createElement('button');
    downloadBtn.textContent = 'Download Drawing';
    downloadBtn.className = 'download-btn';
    downloadBtn.style.padding = '8px 15px';
    downloadBtn.style.marginTop = '10px';
    downloadBtn.style.cursor = 'pointer';
    downloadBtn.style.backgroundColor = '#06D6A0';
    downloadBtn.style.color = 'white';
    downloadBtn.style.border = 'none';
    downloadBtn.style.borderRadius = '4px';
    downloadBtn.style.fontWeight = 'bold';
    downloadBtn.onmouseover = function() {
        this.style.backgroundColor = '#04A57D';
    };
    downloadBtn.onmouseout = function() {
        this.style.backgroundColor = '#06D6A0';
    };
    downloadBtn.onclick = function() {
        const link = document.createElement('a');
        link.download = 'pureblocks-drawing.png';
        link.href = drawingCanvas.toDataURL('image/png');
        link.click();
    };
    
    // Add button directly to the canvas container
    canvasContainer.appendChild(downloadBtn);
}

// Clear the visual output
function clearVisualOutput() {
    const visualOutput = document.getElementById('visualOutput');
    visualOutput.innerHTML = '';
}

// Drawing functions
function set_drawing_color(color) {
    currentDrawingColor = color;
    if (drawingContext) {
        drawingContext.fillStyle = color;
        drawingContext.strokeStyle = color;
    }
    addToConsole(`Set drawing color to ${color}`);
}

function set_fill_mode(fill) {
    fillMode = fill === 'true' || fill === true;
    addToConsole(`Set fill mode to ${fillMode ? 'fill' : 'outline'}`);
}

function set_line_width(width) {
    lineWidth = Number(width);
    if (drawingContext) {
        drawingContext.lineWidth = lineWidth;
    }
    addToConsole(`Set line width to ${lineWidth}`);
}

function clear_canvas() {
    if (!drawingContext) return;
    
    drawingContext.fillStyle = '#ffffff';
    drawingContext.fillRect(0, 0, drawingCanvas.width, drawingCanvas.height);
    drawingContext.fillStyle = currentDrawingColor;
    addToConsole('Cleared canvas');
}

function draw_circle(x, y, radius) {
    if (!drawingContext) return;
    
    drawingContext.beginPath();
    drawingContext.arc(x, y, radius, 0, 2 * Math.PI);
    if (fillMode) {
        drawingContext.fill();
    }
    drawingContext.stroke();
    addToConsole(`Drew circle at (${x}, ${y}) with radius ${radius}`);
}

function draw_rectangle(x, y, width, height) {
    if (!drawingContext) return;
    
    drawingContext.beginPath();
    drawingContext.rect(x, y, width, height);
    if (fillMode) {
        drawingContext.fill();
    }
    drawingContext.stroke();
    addToConsole(`Drew rectangle at (${x}, ${y}) with dimensions ${width}x${height}`);
}

function draw_line(x1, y1, x2, y2) {
    if (!drawingContext) return;
    
    drawingContext.beginPath();
    drawingContext.moveTo(x1, y1);
    drawingContext.lineTo(x2, y2);
    drawingContext.stroke();
    addToConsole(`Drew line from (${x1}, ${y1}) to (${x2}, ${y2})`);
}

function draw_text(x, y, text) {
    if (!drawingContext) return;
    
    drawingContext.fillText(text, x, y);
    addToConsole(`Drew text "${text}" at (${x}, ${y})`);
}

function draw_polygon(sides, centerX, centerY, radius) {
    if (!drawingContext) return;
    
    sides = Math.max(3, Math.min(20, Number(sides)));
    
    drawingContext.beginPath();
    drawingContext.moveTo(centerX + radius, centerY);
    
    for (let i = 1; i <= sides; i++) {
        const angle = (i * 2 * Math.PI / sides);
        const x = centerX + radius * Math.cos(angle);
        const y = centerY + radius * Math.sin(angle);
        drawingContext.lineTo(x, y);
    }
    
    drawingContext.closePath();
    if (fillMode) {
        drawingContext.fill();
    }
    drawingContext.stroke();
    addToConsole(`Drew ${sides}-sided polygon at (${centerX}, ${centerY}) with radius ${radius}`);
}

function draw_arc(x, y, radius, startAngle, endAngle) {
    if (!drawingContext) return;
    
    // Convert angles from degrees to radians
    const startRad = (startAngle * Math.PI) / 180;
    const endRad = (endAngle * Math.PI) / 180;
    
    drawingContext.beginPath();
    drawingContext.arc(x, y, radius, startRad, endRad);
    if (fillMode) {
        drawingContext.fill();
    }
    drawingContext.stroke();
    addToConsole(`Drew arc at (${x}, ${y}) with radius ${radius} from ${startAngle}° to ${endAngle}°`);
}

// Adds text to the console output
function addToConsole(text) {
    const consoleOutput = document.getElementById('consoleOutput');
    consoleOutput.innerHTML += text + '\n';
    // Auto-scroll to bottom
    consoleOutput.scrollTop = consoleOutput.scrollHeight;
}

// Math helper function - check if a number is prime
function is_prime(n) {
    if (n <= 1) return false;
    if (n <= 3) return true;
    if (n % 2 === 0 || n % 3 === 0) return false;
    
    let i = 5;
    while (i * i <= n) {
        if (n % i === 0 || n % (i + 2) === 0) return false;
        i += 6;
    }
    return true;
}

// Very simple Python-like interpreter
function interpretPythonLike(code) {
    try {
        // Create an environment for execution
        const env = {};
        
        // Parse the code into structured blocks
        const codeLines = code.split('\n');
        const codeBlocks = [];
        
        // First pass: Split code into lines and identify indentation
        for (let i = 0; i < codeLines.length; i++) {
            const line = codeLines[i];
            if (!line.trim() || line.trim().startsWith('#')) continue;
            
            const indentMatch = line.match(/^(\s*)/);
            const indentation = indentMatch ? indentMatch[1].length : 0;
            
            codeBlocks.push({
                code: line.trim(),
                indentation: indentation,
                lineNumber: i + 1
            });
        }
        
        // Execute the code blocks
        executeBlocks(codeBlocks, 0, codeBlocks.length, 0, env);
    } catch (error) {
        console.error('Interpreter error:', error);
        addToConsole(`<span style="color: red;">Interpreter error: ${error.message}</span>`);
    }
}

// Execute a range of code blocks with proper indentation handling
function executeBlocks(blocks, start, end, baseIndent, env) {
    for (let i = start; i < end; i++) {
        const block = blocks[i];
        if (block.indentation < baseIndent) break;
        if (block.indentation > baseIndent) continue;
        
        try {
            const code = block.code;
            
            // Handle if statements
            if (code.startsWith('if ') && code.endsWith(':')) {
                const condition = code.substring(3, code.length - 1).trim();
                const result = evaluateExpression(condition, env);
                
                if (result) {
                    // Find the if block body
                    const blockEnd = findBlockEnd(blocks, i + 1, block.indentation);
                    executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                    
                    // Skip any elif/else blocks
                    i = findEndOfControlStructure(blocks, i + 1, block.indentation) - 1;
                } else {
                    // Skip the if block and find elif or else
                    i = findNextElseOrElif(blocks, i + 1, block.indentation) - 1;
                }
                continue;
            }
            
            // Handle elif statements
            if (code.startsWith('elif ') && code.endsWith(':')) {
                const condition = code.substring(5, code.length - 1).trim();
                const result = evaluateExpression(condition, env);
                
                if (result) {
                    // Find the elif block body
                    const blockEnd = findBlockEnd(blocks, i + 1, block.indentation);
                    executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                    
                    // Skip any remaining elif/else blocks
                    i = findEndOfControlStructure(blocks, i + 1, block.indentation) - 1;
                } else {
                    // Skip the elif block and find next elif or else
                    i = findNextElseOrElif(blocks, i + 1, block.indentation) - 1;
                }
                continue;
            }
            
            // Handle else statements
            if (code === 'else:') {
                // Find the else block body
                const blockEnd = findBlockEnd(blocks, i + 1, block.indentation);
                executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                
                // Skip to the end of the else block
                i = blockEnd - 1;
                continue;
            }
            
            // Handle for loops
            if (code.startsWith('for ') && code.includes(' in ') && code.endsWith(':')) {
                const forStatement = code.substring(4, code.length - 1).trim();
                const parts = forStatement.split(' in ');
                const varName = parts[0].trim();
                const iterableExpr = parts[1].trim();
                
                let iterable;
                if (iterableExpr.startsWith('range(')) {
                    // Handle Python-like range
                    const rangeArgs = extractFunctionArgs(iterableExpr, env);
                    iterable = createRange(rangeArgs);
                } else {
                    // Handle other iterables (lists, strings)
                    iterable = evaluateExpression(iterableExpr, env);
                }
                
                // Find the for loop body
                const blockEnd = findBlockEnd(blocks, i + 1, block.indentation);
                
                // Loop over the iterable
                if (Array.isArray(iterable)) {
                    for (const item of iterable) {
                        env[varName] = item;
                        executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                    }
                } else if (typeof iterable === 'string') {
                    for (const char of iterable) {
                        env[varName] = char;
                        executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                    }
                }
                
                // Skip to the end of the for block
                i = blockEnd - 1;
                continue;
            }
            
            // Handle while loops
            if (code.startsWith('while ') && code.endsWith(':')) {
                const condition = code.substring(6, code.length - 1).trim();
                
                // Find the while loop body
                const blockEnd = findBlockEnd(blocks, i + 1, block.indentation);
                
                // Loop while condition is true (with safety counter)
                let safetyCounter = 1000; // Prevent infinite loops
                while (evaluateExpression(condition, env) && safetyCounter > 0) {
                    executeBlocks(blocks, i + 1, blockEnd, block.indentation + 4, env);
                    safetyCounter--;
                }
                
                if (safetyCounter <= 0) {
                    addToConsole(`<span style="color: orange;">Warning: Possible infinite loop at line ${block.lineNumber}. Execution stopped after 1000 iterations.</span>`);
                }
                
                // Skip to the end of the while block
                i = blockEnd - 1;
                continue;
            }
            
            // Handle print statements
            if (code.startsWith('print(') && code.endsWith(')')) {
                const argString = code.substring(6, code.length - 1);
                const value = evaluateExpression(argString, env);
                addToConsole(String(value));
                continue;
            }
            
            // Handle variable assignment
            if (code.includes('=') && !code.includes('==') && !code.includes('>=') && !code.includes('<=')) {
                const parts = code.split('=');
                const varName = parts[0].trim();
                const value = evaluateExpression(parts.slice(1).join('='), env);
                env[varName] = value;
                continue;
            }
            
            // Handle drawing functions
            if (code.startsWith('set_drawing_color(')) {
                const args = extractFunctionArgs(code, env);
                set_drawing_color(args[0]);
                continue;
            }
            
            if (code.startsWith('set_fill_mode(')) {
                const args = extractFunctionArgs(code, env);
                set_fill_mode(args[0]);
                continue;
            }
            
            if (code.startsWith('set_line_width(')) {
                const args = extractFunctionArgs(code, env);
                set_line_width(args[0]);
                continue;
            }
            
            if (code.startsWith('clear_canvas(')) {
                clear_canvas();
                continue;
            }
            
            if (code.startsWith('draw_circle(')) {
                const args = extractFunctionArgs(code, env);
                draw_circle(Number(args[0]), Number(args[1]), Number(args[2]));
                continue;
            }
            
            if (code.startsWith('draw_rectangle(')) {
                const args = extractFunctionArgs(code, env);
                draw_rectangle(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
                continue;
            }
            
            if (code.startsWith('draw_line(')) {
                const args = extractFunctionArgs(code, env);
                draw_line(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
                continue;
            }
            
            if (code.startsWith('draw_text(')) {
                const args = extractFunctionArgs(code, env);
                draw_text(Number(args[0]), Number(args[1]), args[2]);
                continue;
            }
            
            if (code.startsWith('draw_polygon(')) {
                const args = extractFunctionArgs(code, env);
                draw_polygon(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]));
                continue;
            }
            
            if (code.startsWith('draw_arc(')) {
                const args = extractFunctionArgs(code, env);
                draw_arc(Number(args[0]), Number(args[1]), Number(args[2]), Number(args[3]), Number(args[4]));
                continue;
            }
            
            // Unsupported syntax
            addToConsole(`<span style="color: orange;">Warning: Unsupported syntax at line ${block.lineNumber}: ${code}</span>`);
            
        } catch (error) {
            console.error(`Error at line ${block.lineNumber}:`, error);
            addToConsole(`<span style="color: red;">Error at line ${block.lineNumber}: ${error.message}</span>`);
            // Continue execution with next block
        }
    }
}

// Find where a block ends (first line with same or less indentation)
function findBlockEnd(blocks, start, baseIndent) {
    for (let i = start; i < blocks.length; i++) {
        if (blocks[i].indentation <= baseIndent) {
            return i;
        }
    }
    return blocks.length;
}

// Find the next elif or else at the same indentation level
function findNextElseOrElif(blocks, start, baseIndent) {
    for (let i = start; i < blocks.length; i++) {
        if (blocks[i].indentation < baseIndent) {
            return i; // No more elif/else, found parent level
        }
        if (blocks[i].indentation === baseIndent) {
            const code = blocks[i].code;
            if (code.startsWith('elif ') || code === 'else:') {
                return i;
            } else {
                return i; // Found something else at same level, not elif/else
            }
        }
    }
    return blocks.length;
}

// Find the end of an entire control structure (if-elif-else)
function findEndOfControlStructure(blocks, start, baseIndent) {
    for (let i = start; i < blocks.length; i++) {
        if (blocks[i].indentation < baseIndent) {
            return i;
        }
        if (blocks[i].indentation === baseIndent && 
            !blocks[i].code.startsWith('elif ') && 
            blocks[i].code !== 'else:') {
            return i;
        }
    }
    return blocks.length;
}

// Extract arguments from a function call
function extractFunctionArgs(funcCall, env) {
    const argsMatch = funcCall.match(/\((.*)\)/);
    if (!argsMatch) return [];
    
    const argsString = argsMatch[1];
    
    // Handle empty arguments
    if (!argsString.trim()) return [];
    
    // Split by commas, respecting parentheses and quotes
    const args = [];
    let currentArg = '';
    let parenDepth = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;
    
    for (let i = 0; i < argsString.length; i++) {
        const char = argsString[i];
        
        if (char === '(' && !inSingleQuote && !inDoubleQuote) {
            parenDepth++;
            currentArg += char;
        } else if (char === ')' && !inSingleQuote && !inDoubleQuote) {
            parenDepth--;
            currentArg += char;
        } else if (char === "'" && !inDoubleQuote) {
            inSingleQuote = !inSingleQuote;
            currentArg += char;
        } else if (char === '"' && !inSingleQuote) {
            inDoubleQuote = !inDoubleQuote;
            currentArg += char;
        } else if (char === ',' && parenDepth === 0 && !inSingleQuote && !inDoubleQuote) {
            args.push(evaluateExpression(currentArg.trim(), env));
            currentArg = '';
        } else {
            currentArg += char;
        }
    }
    
    if (currentArg.trim()) {
        args.push(evaluateExpression(currentArg.trim(), env));
    }
    
    return args;
}

// Create a Python-like range array
function createRange(args) {
    let start, stop, step;
    
    if (args.length === 1) {
        start = 0;
        stop = args[0];
        step = 1;
    } else if (args.length === 2) {
        start = args[0];
        stop = args[1];
        step = 1;
    } else {
        start = args[0];
        stop = args[1];
        step = args[2];
    }
    
    const result = [];
    if (step > 0) {
        for (let i = start; i < stop; i += step) {
            result.push(i);
        }
    } else {
        for (let i = start; i > stop; i += step) {
            result.push(i);
        }
    }
    
    return result;
}

// Evaluate expressions, including variables, literals, and operators
function evaluateExpression(expr, env) {
    expr = expr.trim();
    
    // Empty expression
    if (!expr) return undefined;
    
    // String literals
    if ((expr.startsWith('"') && expr.endsWith('"')) || 
        (expr.startsWith("'") && expr.endsWith("'"))) {
        return expr.substring(1, expr.length - 1);
    }
    
    // Numeric literals
    if (!isNaN(expr)) {
        return Number(expr);
    }
    
    // Boolean literals
    if (expr === 'True') return true;
    if (expr === 'False') return false;
    
    // Variable lookup
    if (/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(expr) && expr in env) {
        return env[expr];
    }
    
    // Function calls - special handling for our supported functions
    if (expr.startsWith('is_prime(')) {
        const args = extractFunctionArgs(expr, env);
        return is_prime(Number(args[0]));
    }
    
    // Range function for generation
    if (expr.startsWith('range(')) {
        const args = extractFunctionArgs(expr, env);
        return createRange(args);
    }
    
    // Handle basic comparison operators
    if (expr.includes('==')) {
        const parts = expr.split('==').map(p => p.trim());
        return evaluateExpression(parts[0], env) == evaluateExpression(parts[1], env);
    }
    
    if (expr.includes('!=')) {
        const parts = expr.split('!=').map(p => p.trim());
        return evaluateExpression(parts[0], env) != evaluateExpression(parts[1], env);
    }
    
    if (expr.includes('>=')) {
        const parts = expr.split('>=').map(p => p.trim());
        return evaluateExpression(parts[0], env) >= evaluateExpression(parts[1], env);
    }
    
    if (expr.includes('<=')) {
        const parts = expr.split('<=').map(p => p.trim());
        return evaluateExpression(parts[0], env) <= evaluateExpression(parts[1], env);
    }
    
    if (expr.includes('>') && !expr.includes('>=')) {
        const parts = expr.split('>').map(p => p.trim());
        return evaluateExpression(parts[0], env) > evaluateExpression(parts[1], env);
    }
    
    if (expr.includes('<') && !expr.includes('<=')) {
        const parts = expr.split('<').map(p => p.trim());
        return evaluateExpression(parts[0], env) < evaluateExpression(parts[1], env);
    }
    
    // Handle logical operators
    if (expr.includes(' and ')) {
        const parts = expr.split(' and ').map(p => p.trim());
        return evaluateExpression(parts[0], env) && evaluateExpression(parts[1], env);
    }
    
    if (expr.includes(' or ')) {
        const parts = expr.split(' or ').map(p => p.trim());
        return evaluateExpression(parts[0], env) || evaluateExpression(parts[1], env);
    }
    
    if (expr.startsWith('not ')) {
        return !evaluateExpression(expr.substring(4), env);
    }
    
    // Last resort: try to substitute known variables and evaluate as JS
    // IMPORTANT: This is not secure for user-facing applications!
    try {
        // Create a sanitized expression with all variables replaced
        let jsExpr = expr.replace(/\b[a-zA-Z_][a-zA-Z0-9_]*\b/g, match => {
            if (match in env) {
                const val = env[match];
                if (typeof val === 'string') return `"${val}"`;
                return val;
            }
            return 'undefined';
        });
        
        return eval(jsExpr);
    } catch (error) {
        throw new Error(`Cannot evaluate expression: ${expr}`);
    }
} 