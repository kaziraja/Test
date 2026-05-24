let display = document.getElementById('display');

function appendNumber(num) {
    if (display.value === '0' && num !== '.') {
        display.value = num;
    } else if (num === '.' && display.value.includes('.')) {
        return;
    } else {
        display.value += num;
    }
}

function appendOperator(op) {
    let currentValue = display.value;
    
    // Prevent multiple operators in a row
    if (['+', '-', '*', '/'].includes(currentValue[currentValue.length - 1])) {
        return;
    }
    
    // Prevent operator at the beginning (except minus for negative numbers)
    if (currentValue === '' && op !== '-') {
        return;
    }
    
    display.value += op;
}

function deleteLast() {
    display.value = display.value.slice(0, -1) || '0';
}

function clearDisplay() {
    display.value = '0';
}

function calculate() {
    try {
        let result = eval(display.value);
        
        // Handle division by zero
        if (!isFinite(result)) {
            display.value = 'Error';
            return;
        }
        
        // Round to avoid floating point errors
        display.value = Math.round(result * 100000000) / 100000000;
    } catch (error) {
        display.value = 'Error';
    }
}

// Allow keyboard input
document.addEventListener('keydown', (e) => {
    const key = e.key;
    
    if (key >= '0' && key <= '9') {
        appendNumber(key);
    } else if (key === '.') {
        appendNumber('.');
    } else if (key === '+' || key === '-' || key === '*' || key === '/') {
        e.preventDefault();
        appendOperator(key);
    } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
    } else if (key === 'Backspace') {
        e.preventDefault();
        deleteLast();
    } else if (key === 'Escape') {
        clearDisplay();
    }
});
