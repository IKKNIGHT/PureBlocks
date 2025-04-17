// PureBlocks - Python Code Generator Extensions

// Make sure Blockly.Python is available
if (typeof Blockly === 'undefined') {
  console.error('Error: Blockly is not loaded. Ensure Blockly is included before this script.');
}

(function() {
  // Wait until Blockly and Blockly.Python are available
  const initGenerator = function() {
    if (typeof Blockly !== 'undefined' && Blockly.Python) {
      // Check if the generator has already been initialized
      if (Blockly.Python.initialized) {
        return;
      }

      // Mark as initialized
      Blockly.Python.initialized = true;
      
      // Initialize the Python generator
      var Python = Blockly.Python;

      /**
       * List of illegal variable names.
       */
      Python.addReservedWords(
          // import keyword
          // print(','.join(sorted(keyword.kwlist)))
          // https://docs.python.org/3/reference/lexical_analysis.html#keywords
          // https://docs.python.org/2/reference/lexical_analysis.html#keywords
          'False,None,True,and,as,assert,break,class,continue,def,del,elif,else,' +
          'except,exec,finally,for,from,global,if,import,in,is,lambda,nonlocal,' +
          'not,or,pass,print,raise,return,try,while,with,yield,' +
          // https://docs.python.org/3/library/constants.html
          // https://docs.python.org/2/library/constants.html
          'NotImplemented,Ellipsis,__debug__,quit,exit,copyright,license,credits,' +
          // Added for this specific implementation
          'range,len,int,float,str,list,dict,set,math,random,numpy,matplotlib'
      );

      /**
       * Order of operation ENUMs.
       * https://docs.python.org/3/reference/expressions.html#operator-precedence
       */
      Python.ORDER_ATOMIC = 0;            // 0 "" ...
      Python.ORDER_COLLECTION = 1;        // tuples, lists, dictionaries
      Python.ORDER_STRING_CONVERSION = 1; // `expression...`
      Python.ORDER_MEMBER = 2.1;          // . []
      Python.ORDER_FUNCTION_CALL = 2.2;   // ()
      Python.ORDER_EXPONENTIATION = 3;    // **
      Python.ORDER_UNARY_SIGN = 4;        // + -
      Python.ORDER_BITWISE_NOT = 4;       // ~
      Python.ORDER_MULTIPLICATIVE = 5;    // * / // %
      Python.ORDER_ADDITIVE = 6;          // + -
      Python.ORDER_BITWISE_SHIFT = 7;     // << >>
      Python.ORDER_BITWISE_AND = 8;       // &
      Python.ORDER_BITWISE_XOR = 9;       // ^
      Python.ORDER_BITWISE_OR = 10;       // |
      Python.ORDER_COMPARITIVE = 11;      // in, not in, is, is not,
                                          // <, <=, >, >=, <>, !=, ==
      Python.ORDER_LOGICAL_NOT = 12;      // not
      Python.ORDER_LOGICAL_AND = 13;      // and
      Python.ORDER_LOGICAL_OR = 14;       // or
      Python.ORDER_CONDITIONAL = 15;      // if else
      Python.ORDER_LAMBDA = 16;           // lambda
      Python.ORDER_NONE = 99;             // (...)

      // Set up the Python generator with proper indentation
      Python.INDENT = '    ';

      // Make sure statementToCode exists
      if (!Python.statementToCode) {
        Python.statementToCode = function(block, name) {
          var targetBlock = block.getInputTargetBlock(name);
          var code = '';
          if (targetBlock) {
            code = this.blockToCode(targetBlock);
            if (typeof code !== 'string') {
              // Value blocks return tuples of code and operator order.
              // Strip off the operator order and discard.
              code = code[0];
            }
            code = this.prefixLines(code, this.INDENT);
          }
          return code;
        };
      }

      // Basic Math Blocks
      Python.forBlock['math_number'] = function(block) {
        // Numeric value.
        var code = parseFloat(block.getFieldValue('NUM'));
        var order = code >= 0 ? Python.ORDER_ATOMIC : Python.ORDER_UNARY_SIGN;
        return [code, order];
      };

      Python.forBlock['math_arithmetic'] = function(block) {
        // Basic arithmetic operators, and power.
        var OPERATORS = {
          'ADD': [' + ', Python.ORDER_ADDITIVE],
          'MINUS': [' - ', Python.ORDER_ADDITIVE],
          'MULTIPLY': [' * ', Python.ORDER_MULTIPLICATIVE],
          'DIVIDE': [' / ', Python.ORDER_MULTIPLICATIVE],
          'POWER': [' ** ', Python.ORDER_EXPONENTIATION]
        };
        var tuple = OPERATORS[block.getFieldValue('OP')];
        var operator = tuple[0];
        var order = tuple[1];
        var argument0 = Python.valueToCode(block, 'A', order) || '0';
        var argument1 = Python.valueToCode(block, 'B', order) || '0';
        var code = argument0 + operator + argument1;
        return [code, order];
      };

      // Custom Math Blocks
      Python.forBlock['math_is_prime'] = function(block) {
        var number = Python.valueToCode(block, 'NUMBER', Python.ORDER_FUNCTION_CALL) || '0';
        var functionName = Python.provideFunction_(
            'is_prime',
            ['def ' + Python.FUNCTION_NAME_PLACEHOLDER_ + '(n):',
             '  if n <= 1:',
             '    return False',
             '  if n <= 3:',
             '    return True',
             '  if n % 2 == 0 or n % 3 == 0:',
             '    return False',
             '  i = 5',
             '  while i * i <= n:',
             '    if n % i == 0 or n % (i + 2) == 0:',
             '      return False',
             '    i += 6',
             '  return True']);
        var code = functionName + '(' + number + ')';
        return [code, Python.ORDER_FUNCTION_CALL];
      };

      // Drawing blocks
      Python.forBlock['drawing_circle'] = function(block) {
        var x = Python.valueToCode(block, 'X', Python.ORDER_NONE) || '0';
        var y = Python.valueToCode(block, 'Y', Python.ORDER_NONE) || '0';
        var radius = Python.valueToCode(block, 'RADIUS', Python.ORDER_NONE) || '10';
        
        var code = 'draw_circle(' + x + ', ' + y + ', ' + radius + ')\n';
        return code;
      };

      Python.forBlock['drawing_rectangle'] = function(block) {
        var x = Python.valueToCode(block, 'X', Python.ORDER_NONE) || '0';
        var y = Python.valueToCode(block, 'Y', Python.ORDER_NONE) || '0';
        var width = Python.valueToCode(block, 'WIDTH', Python.ORDER_NONE) || '50';
        var height = Python.valueToCode(block, 'HEIGHT', Python.ORDER_NONE) || '30';
        
        var code = 'draw_rectangle(' + x + ', ' + y + ', ' + width + ', ' + height + ')\n';
        return code;
      };

      Python.forBlock['drawing_line'] = function(block) {
        var x1 = Python.valueToCode(block, 'X1', Python.ORDER_NONE) || '0';
        var y1 = Python.valueToCode(block, 'Y1', Python.ORDER_NONE) || '0';
        var x2 = Python.valueToCode(block, 'X2', Python.ORDER_NONE) || '100';
        var y2 = Python.valueToCode(block, 'Y2', Python.ORDER_NONE) || '100';
        
        var code = 'draw_line(' + x1 + ', ' + y1 + ', ' + x2 + ', ' + y2 + ')\n';
        return code;
      };

      Python.forBlock['drawing_text'] = function(block) {
        var x = Python.valueToCode(block, 'X', Python.ORDER_NONE) || '0';
        var y = Python.valueToCode(block, 'Y', Python.ORDER_NONE) || '0';
        var text = Python.valueToCode(block, 'TEXT', Python.ORDER_NONE) || '""';
        
        var code = 'draw_text(' + x + ', ' + y + ', ' + text + ')\n';
        return code;
      };

      Python.forBlock['drawing_color'] = function(block) {
        var color = block.getFieldValue('COLOR') || '#ff0000';
        
        var code = 'set_drawing_color("' + color + '")\n';
        return code;
      };

      // New drawing blocks
      Python.forBlock['drawing_fill_toggle'] = function(block) {
        var fill = block.getFieldValue('FILL') || 'true';
        var code = 'set_fill_mode(' + fill + ')\n';
        return code;
      };
      
      Python.forBlock['drawing_line_width'] = function(block) {
        var width = Python.valueToCode(block, 'WIDTH', Python.ORDER_NONE) || '1';
        var code = 'set_line_width(' + width + ')\n';
        return code;
      };
      
      Python.forBlock['drawing_clear'] = function(block) {
        var code = 'clear_canvas()\n';
        return code;
      };
      
      Python.forBlock['drawing_polygon'] = function(block) {
        var sides = Python.valueToCode(block, 'SIDES', Python.ORDER_NONE) || '3';
        var x = Python.valueToCode(block, 'X', Python.ORDER_NONE) || '100';
        var y = Python.valueToCode(block, 'Y', Python.ORDER_NONE) || '100';
        var radius = Python.valueToCode(block, 'RADIUS', Python.ORDER_NONE) || '50';
        
        var code = 'draw_polygon(' + sides + ', ' + x + ', ' + y + ', ' + radius + ')\n';
        return code;
      };
      
      Python.forBlock['drawing_arc'] = function(block) {
        var x = Python.valueToCode(block, 'X', Python.ORDER_NONE) || '100';
        var y = Python.valueToCode(block, 'Y', Python.ORDER_NONE) || '100';
        var radius = Python.valueToCode(block, 'RADIUS', Python.ORDER_NONE) || '50';
        var startAngle = Python.valueToCode(block, 'START_ANGLE', Python.ORDER_NONE) || '0';
        var endAngle = Python.valueToCode(block, 'END_ANGLE', Python.ORDER_NONE) || '180';
        
        var code = 'draw_arc(' + x + ', ' + y + ', ' + radius + ', ' + startAngle + ', ' + endAngle + ')\n';
        return code;
      };

      // Control flow
      Python.forBlock['controls_if'] = function(block) {
        // If/elseif/else condition.
        var n = 0;
        var code = '', branchCode, conditionCode;
        do {
          conditionCode = Python.valueToCode(block, 'IF' + n,
              Python.ORDER_NONE) || 'False';
          branchCode = Python.statementToCode(block, 'DO' + n);
          code += (n > 0 ? 'el' : '') + 'if ' + conditionCode + ':\n' + branchCode;
          ++n;
        } while (block.getInput('IF' + n));

        if (block.getInput('ELSE')) {
          branchCode = Python.statementToCode(block, 'ELSE');
          code += 'else:\n' + branchCode;
        }
        return code;
      };

      Python.forBlock['controls_repeat_ext'] = function(block) {
        // Repeat n times.
        var repeats = Python.valueToCode(block, 'TIMES', Python.ORDER_NONE) || '0';
        var branch = Python.statementToCode(block, 'DO') || Python.PASS;
        var loopIndexVar = Python.nameDB_ ? 
          Python.nameDB_.getDistinctName('count', 'variable') : 
          'count';
        var code = 'for ' + loopIndexVar + ' in range(' + repeats + '):\n' + branch;
        return code;
      };

      Python.forBlock['controls_forEach'] = function(block) {
        // For each loop.
        var variable0 = Python.nameDB_ ? 
          Python.nameDB_.getName(block.getFieldValue('VAR'), 'variable') : 
          block.getFieldValue('VAR');
        var argument0 = Python.valueToCode(block, 'LIST', Python.ORDER_NONE) || '[]';
        var branch = Python.statementToCode(block, 'DO') || Python.PASS;
        var code = 'for ' + variable0 + ' in ' + argument0 + ':\n' + branch;
        return code;
      };

      Python.forBlock['controls_for'] = function(block) {
        // For loop with range.
        var variable0 = Python.nameDB_ ? 
          Python.nameDB_.getName(block.getFieldValue('VAR'), 'variable') : 
          block.getFieldValue('VAR');
        var argument0 = Python.valueToCode(block, 'FROM', Python.ORDER_NONE) || '0';
        var argument1 = Python.valueToCode(block, 'TO', Python.ORDER_NONE) || '0';
        var increment = Python.valueToCode(block, 'BY', Python.ORDER_NONE) || '1';
        var branch = Python.statementToCode(block, 'DO') || Python.PASS;
        
        var code = '';
        var range;
        
        // Helper function to generate the appropriate range call
        function makeRange(start, end, inc) {
          if (inc === '1') {
            return 'range(' + start + ', ' + end + ' + 1)';
          } else {
            return 'range(' + start + ', ' + end + ' + 1, ' + inc + ')';
          }
        }
        
        range = makeRange(argument0, argument1, increment);
        code = 'for ' + variable0 + ' in ' + range + ':\n' + branch;
        
        return code;
      };

      // Variables
      Python.forBlock['variables_get'] = function(block) {
        // Variable getter.
        var code = Python.nameDB_ ? 
          Python.nameDB_.getName(block.getFieldValue('VAR'), 'variable') : 
          block.getFieldValue('VAR');
        return [code, Python.ORDER_ATOMIC];
      };

      Python.forBlock['variables_set'] = function(block) {
        // Variable setter.
        var argument0 = Python.valueToCode(block, 'VALUE', Python.ORDER_NONE) || '0';
        var varName = Python.nameDB_ ? 
          Python.nameDB_.getName(block.getFieldValue('VAR'), 'variable') : 
          block.getFieldValue('VAR');
        return varName + ' = ' + argument0 + '\n';
      };

      // Text blocks
      Python.forBlock['text'] = function(block) {
        // Text value.
        var code = Python.quote_(block.getFieldValue('TEXT'));
        return [code, Python.ORDER_ATOMIC];
      };

      Python.forBlock['text_print'] = function(block) {
        // Print statement.
        var msg = Python.valueToCode(block, 'TEXT', Python.ORDER_NONE) || '""';
        return 'print(' + msg + ')\n';
      };

      // Ensure we have a quote_ function
      if (!Python.quote_) {
        Python.quote_ = function(string) {
          string = string.replace(/\\/g, '\\\\')
              .replace(/\n/g, '\\n')
              .replace(/\%/g, '\\%')
              .replace(/'/g, '\\\'');
          return '\'' + string + '\'';
        };
      }

      // Ensure we have the basic definitions needed
      if (!Python.definitions_) {
        Python.definitions_ = Object.create(null);
      }

      // Add a standard PASS constant if missing
      if (!Python.PASS) {
        Python.PASS = 'pass\n';
      }

      console.log("Python generator initialized successfully");
    } else {
      console.error("Blockly.Python is not available yet, retrying...");
      setTimeout(initGenerator, 100);
    }
  };

  // Try to initialize right away
  initGenerator();

  // Also try after a delay to make sure all scripts have loaded
  setTimeout(initGenerator, 500);
  setTimeout(initGenerator, 1000);
  setTimeout(initGenerator, 2000);
})();