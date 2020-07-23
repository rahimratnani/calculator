// Global variables
const inputArray = []; // holds numbers and operator inputs
const displayArray = []; // holds value here before being pushed to updateDisplay
const tempInput = []; // for positive/negative key

const add = (num1, num2) => num1 + num2;
const subtract = (num1, num2) => num1 - num2;
const multiply = (num1, num2) => num1 * num2;
const divide = (num1, num2) => num1 / num2;
const percentage = (num, per) => (num / 100) * per;

const displayError = () => {
    displayArray.splice(0);
    displayArray.push('ERROR');
    updateDisplay(displayArray);
    return;
}

const enableDecimal = () => {
    const decimal = document.querySelector('#decimal');
    decimal.disabled = false;
}


// Event functions
const updateDisplay = content => {
    if (content == 'undefined' || content == 'NaN') {
        content = ['ERROR'];
    }
    const display = document.querySelector('.js-display');
    let displayContent = content.join('');
    if (isNaN(displayContent) === false && Number(displayContent) % 1 !== 0) {
        if (displayContent.split('.')[1].length > 4) {
            displayContent = Number(displayContent).toFixed(4);
        }
    }
    display.textContent = displayContent;
    return;
};

const getPositiveNegative = () => {
    if (tempInput.length === 0) return;
    let sign = '-';
    if (Number(tempInput[0]) < 0) {
        tempInput[0] = tempInput[0].split('');
        tempInput[0].shift();
        tempInput[0] = tempInput[0].join('');
    } else {
        tempInput[0] = sign + tempInput[0];
    }

    inputArray.splice(-tempInput.length, tempInput.length);
    for (let i = 0; i < tempInput.length; i++) {
        inputArray.push(tempInput[i]);
    }
    displayArray.splice(0);
    displayArray.push(tempInput.join(''));
    updateDisplay(displayArray);
}

const clearEverything = () => {
    inputArray.splice(0);
    tempInput.splice(0);
    displayArray.splice(0, displayArray.length, '0');
    updateDisplay(displayArray);
    displayArray.splice(0);
    enableDecimal();
    return;
}

const deleteLastInput = () => {
    inputArray.pop();
    tempInput.pop();
    displayArray.pop();
    updateDisplay(displayArray);
    if (displayArray.length === 0) {
        displayArray.push('0');
        updateDisplay(displayArray);
        displayArray.splice(0);
    }
}

const getPercentage = () => {
    let values = inputArray.join('').split('*');
    let result = percentage(Number(values[0]), Number(values[1]));
    inputArray.splice(0, inputArray.length, result);
    tempInput.splice(0, tempInput.length, result);
    displayArray.splice(0, displayArray.length, result);
    updateDisplay(displayArray);
    displayArray.splice(0);
}


// Normal functions
function operate(operator, num1, num2) {
    switch (true) {
        case operator === "+":
            return add(num1, num2);
        case operator === "-":
            return subtract(num1, num2);
        case operator === "*":
            return multiply(num1, num2);
        case operator === "/":
            return divide(num1, num2);
    }
}

function validateInput() {
    // not end with any sign or .
    if (isNaN(inputArray[inputArray.length - 1])) inputArray.pop();
    // no two signs subsequantly
    for (let i = 0; i < inputArray.length; i++) {
        if (inputArray[i] === '/' && inputArray[i + 1] === '0') {
            displayError();
            return false;
        }
        if (isNaN(inputArray[i]) && inputArray[i] !== '.' && isNaN(inputArray[i + 1]) && inputArray[i + 1] !== '.') {
            displayError();
            return false;
        }
    }
}



const numKeys = document.querySelectorAll('.js-number');
numKeys.forEach(key => {
    key.addEventListener('click', e => {
        inputArray.push(e.target.textContent); // num key pushed as string value
        tempInput.push(e.target.textContent);
        displayArray.push(e.target.textContent); // number will be pushed to display array
        updateDisplay(displayArray); // display array is passed to update function
        if (e.target.textContent === '.') {
            const decimal = document.querySelector('#decimal');
            decimal.disabled = true;
        }
    });
});

const functionKeys = document.querySelectorAll('.js-func');
functionKeys.forEach(key => {
    key.addEventListener('click', function () {
        // clears display array, so new number can be showd after operator key is clicked
        displayArray.splice(0);
        switch (true) {
            case this.id === 'plus':
                inputArray.push('+');
                break;
            case this.id === 'minus':
                inputArray.push('-');
                break;
            case this.id === 'multiply':
                inputArray.push('*');
                break;
            case this.id === 'divide':
                inputArray.push('/');
                break;
        }
        tempInput.splice(0);
        enableDecimal();
    });
});

const equals = document.querySelector('.js-equals');
equals.addEventListener('click', () => {
    // validateInput() // currently only checks for decimals in start and end of the array
    let isValid = validateInput();
    let tempString = '';
    const validInput = [];

    if (isValid === false) return;

    for (let i = 0; i < inputArray.length; i++) {
        if (isNaN(inputArray[i]) === false) {
            tempString += inputArray[i];
        } else if (inputArray[i] === '.') {
            tempString += inputArray[i];
        } else {
            validInput.splice(validInput.length, 0, tempString, inputArray[i]);
            tempString = '';
        }
    }

    if (tempString !== '') {
        validInput.push(tempString);
        tempString = '';
    }

    let tempResult = '';
    for (let i = 0; i < validInput.length; i++) {
        if (isNaN(validInput[i]) === false || validInput[i] === '.') {
            tempResult += validInput[i];
        } else {
            if (validInput[i] === '+') {
                tempResult = operate('+', Number(tempResult), Number(validInput.slice(i + 1, i + 2)));
                tempResult = tempResult.toString();
                i++;
            } else if (validInput[i] === '-') {
                tempResult = operate('-', Number(tempResult), Number(validInput.slice(i + 1, i + 2)));
                tempResult = tempResult.toString();
                i++;
            } else if (validInput[i] === '*') {
                tempResult = operate('*', Number(tempResult), Number(validInput.slice(i + 1, i + 2)));
                tempResult = tempResult.toString();
                i++;
            } else if (validInput[i] === '/') {
                tempResult = operate('/', Number(tempResult), Number(validInput.slice(i + 1, i + 2)));
                tempResult = tempResult.toString();
                i++;
            }
        }
    }

    inputArray.splice(0, inputArray.length, tempResult);
    displayArray.splice(0, displayArray.length, tempResult);
    updateDisplay(displayArray);
    tempInput.splice(0);
    tempInput.push(tempResult);
    enableDecimal();
});

const positiveNegativeKey = document.querySelector('.js-plus-minus');
positiveNegativeKey.addEventListener('click', getPositiveNegative);

const clear = document.querySelector('.js-clear');
clear.addEventListener('click', clearEverything);

const backSpace = document.querySelector('.js-back-space');
backSpace.addEventListener('click', deleteLastInput);

const percent = document.querySelector('.js-percent');
percent.addEventListener('click', getPercentage)