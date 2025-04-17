// PureBlocks - Custom Block Definitions

// Define a theme for our blocks if it doesn't exist
if (typeof Blockly !== 'undefined') {
    // Register custom block types with simpler definitions
    
    // Math Blocks
    Blockly.Blocks['math_is_prime'] = {
        init: function() {
            this.appendValueInput('NUMBER')
                .setCheck('Number')
                .appendField('is prime');
            this.setOutput(true, 'Boolean');
            this.setColour('#FFD166');
            this.setTooltip('Returns true if the number is prime, false otherwise');
        }
    };
    
    // Drawing Blocks - using a simpler approach
    Blockly.Blocks['drawing_circle'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw circle');
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('x');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('y');
            this.appendValueInput('RADIUS')
                .setCheck('Number')
                .appendField('radius');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    Blockly.Blocks['drawing_rectangle'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw rectangle');
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('x');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('y');
            this.appendValueInput('WIDTH')
                .setCheck('Number')
                .appendField('width');
            this.appendValueInput('HEIGHT')
                .setCheck('Number')
                .appendField('height');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    Blockly.Blocks['drawing_line'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw line');
            this.appendValueInput('X1')
                .setCheck('Number')
                .appendField('from x');
            this.appendValueInput('Y1')
                .setCheck('Number')
                .appendField('from y');
            this.appendValueInput('X2')
                .setCheck('Number')
                .appendField('to x');
            this.appendValueInput('Y2')
                .setCheck('Number')
                .appendField('to y');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    Blockly.Blocks['drawing_text'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw text');
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('x');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('y');
            this.appendValueInput('TEXT')
                .setCheck('String')
                .appendField('text');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    Blockly.Blocks['drawing_color'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('set drawing color')
                .appendField(new Blockly.FieldColor('#ff0000'), 'COLOR');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    // Add new drawing blocks
    
    // Fill shapes toggle block
    Blockly.Blocks['drawing_fill_toggle'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('set fill mode')
                .appendField(new Blockly.FieldDropdown([
                    ['fill', 'true'],
                    ['outline', 'false']
                ]), 'FILL');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    // Line width block
    Blockly.Blocks['drawing_line_width'] = {
        init: function() {
            this.appendValueInput('WIDTH')
                .setCheck('Number')
                .appendField('set line width');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    // Clear canvas block
    Blockly.Blocks['drawing_clear'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('clear drawing canvas');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    // Draw polygon block
    Blockly.Blocks['drawing_polygon'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw polygon with');
            this.appendValueInput('SIDES')
                .setCheck('Number')
                .appendField('sides');
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('center x');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('center y');
            this.appendValueInput('RADIUS')
                .setCheck('Number')
                .appendField('radius');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
    
    // Draw arc block
    Blockly.Blocks['drawing_arc'] = {
        init: function() {
            this.appendDummyInput()
                .appendField('draw arc');
            this.appendValueInput('X')
                .setCheck('Number')
                .appendField('x');
            this.appendValueInput('Y')
                .setCheck('Number')
                .appendField('y');
            this.appendValueInput('RADIUS')
                .setCheck('Number')
                .appendField('radius');
            this.appendValueInput('START_ANGLE')
                .setCheck('Number')
                .appendField('start angle');
            this.appendValueInput('END_ANGLE')
                .setCheck('Number')
                .appendField('end angle');
            this.setPreviousStatement(true, null);
            this.setNextStatement(true, null);
            this.setColour('#06D6A0');
        }
    };
}