let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const operations = ['+', '-', '×'];
    const operation = operations[Math.floor(Math.random() * operations.length)];
    
    let num1, num2;
    
    switch(operation) {
        case '+':
            num1 = Math.floor(Math.random() * 900) + 100; // 100-999
            num2 = Math.floor(Math.random() * 900) + 100;
            break;
        case '-':
            num1 = Math.floor(Math.random() * 900) + 100;
            num2 = Math.floor(Math.random() * num1); // Asegurar resultado positivo
            break;
        case '×':
            num1 = Math.floor(Math.random() * 90) + 10; // 10-99
            num2 = Math.floor(Math.random() * 90) + 10;
            break;
    }
    
    let exactResult;
    switch(operation) {
        case '+': exactResult = num1 + num2; break;
        case '-': exactResult = num1 - num2; break;
        case '×': exactResult = num1 * num2; break;
    }
    
    // Para estimaciones, aceptamos un margen de error del 10%
    const margin = Math.floor(exactResult * 0.1);
    const minAcceptable = exactResult - margin;
    const maxAcceptable = exactResult + margin;
    
    currentExercise = {
        num1: num1,
        num2: num2,
        operation: operation,
        minAcceptable: minAcceptable,
        maxAcceptable: maxAcceptable,
        exactResult: exactResult
    };
    
    document.getElementById('exercise').innerHTML = `
        <p>Estima: ${num1} ${operation} ${num2}</p>
        <p><small>Tu respuesta debe estar dentro del 10% del valor real</small></p>
    `;
    document.getElementById('userAnswer').value = '';
    document.getElementById('result').innerHTML = '';
}

function checkAnswer() {
    const userAnswer = parseInt(document.getElementById('userAnswer').value.trim());
    const resultDiv = document.getElementById('result');
    
    if (!currentExercise) {
        resultDiv.innerHTML = 'Primero genera un ejercicio';
        return;
    }
    
    if (isNaN(userAnswer)) {
        resultDiv.innerHTML = 'Por favor, ingresa un número válido';
        resultDiv.className = 'incorrect';
        return;
    }
    
    if (userAnswer >= currentExercise.minAcceptable && userAnswer <= currentExercise.maxAcceptable) {
        resultDiv.innerHTML = `¡Correcto! Tu estimación es aceptable. El valor exacto es: ${currentExercise.exactResult}`;
        resultDiv.className = 'correct';
    } else {
        resultDiv.innerHTML = `Tu estimación está fuera del rango aceptable. El valor exacto es: ${currentExercise.exactResult}`;
        resultDiv.className = 'incorrect';
    }
}

// Generar un ejercicio al cargar la página
generateExercise();