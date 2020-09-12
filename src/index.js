function eval() {
    // Do not use eval!!!
    return;
}

function expressionCalculator(expr) {
    const priority = { '(': 0, '+': 1, '-': 1, '*': 2, '/': 2, '^': 3 };
    const operators = ['+', '-', '*', '/', '^'];
    const brackets = ['(', ')'];

    let output = [];
    let stackOperators = [];
    let operator;

    const exprArr = exprToArray(expr, operators, brackets);
    if (!isValidBrackets(exprArr)) throw Error('ExpressionError: Brackets must be paired')

    for (let i = 0; i < exprArr.length; i++) {
        if (!operators.includes(exprArr[i]) && !brackets.includes(exprArr[i])) {
            output.push(exprArr[i]);
            continue;
        }

        if (exprArr[i] === ')') {
            operator = stackOperators.pop();
            while (operator !== '(') {
                output.push(operator);
                operator = stackOperators.pop();
                if (stackOperators.length === 0 && operator !== '(') throw Error('ExpressionError: Brackets must be paired');
            }
            continue;
        }

        if (operators.includes(exprArr[i])) {
            operator = stackOperators[stackOperators.length - 1];
            while (operator && priority[operator] >= priority[exprArr[i]]) {
                output.push(stackOperators.pop());
                operator = stackOperators[stackOperators.length - 1];
            }
        }

        stackOperators.push(exprArr[i]);
    }

    return calculate(output.concat(stackOperators.reverse()));
}

function isValidBrackets(expr) {
    const [count1, count2] = expr.reduce((acc, curr) => {
        if (curr === '(') return [acc[0] + 1, acc[1]];
        else if (curr === ')') return [acc[0], acc[1] + 1];
        return acc;
    }, [0, 0]);
    return count1 === count2;
}

function exprToArray(expr, operators, brackets) {
    const clearExpr = expr.replace(/\s+/g, '');
    let number = '';
    let result = [];
    for (let i = 0; i < clearExpr.length; i++) {
        if (Number.isInteger(+clearExpr[i])) { number += clearExpr[i]; }
        else if (operators.includes(clearExpr[i]) || brackets.includes(clearExpr[i])) {
            if (number) result.push(number);
            result.push(clearExpr[i]);
            number = '';
        }
    }
    if (number) result.push(number);
    return result;
}

function calculate(RPT) {
    const op = {
        '+': (x, y) => x + y,
        '-': (x, y) => x - y,
        '*': (x, y) => x * y,
        '/': (x, y) => x / y,
        '^': (x, y) => Math.pow(x, y)
    }
    const operators = ['+', '-', '*', '/', '^'];
    const stack = [];
    let a, b;

    for (let i = 0; i < RPT.length; i++) {
        if (!operators.includes(RPT[i])) stack.push(RPT[i]);
        else {
            [a, b] = [Number(stack.pop()), Number(stack.pop())];
            if (RPT[i] === '/' && a === 0) throw Error('TypeError: Division by zero.')
            stack.push(op[RPT[i]](b, a));
        }
    }

    return stack.pop();
}

module.exports = {
    expressionCalculator
}