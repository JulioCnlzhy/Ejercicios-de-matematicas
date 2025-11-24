let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const operation = Math.random() > 0.5 ? '+' : '-';
    let num1, num2;
    
    if (operation === '+') {
        num1 = (Math.random() * 100).toFixed(2);
        num2 = (Math.random() * 100).toFixed(2);
    } else {
        // Para resta, asegurar que el primer número sea mayor
        num1 = (Math.random() * 100 + 50).toFixed(2);
        num2 = (Math.random() * 50).toFixed(2);
    }
    
    const result = operation === '+' ? 
        (parseFloat(num1) + parseFloat(num2)).toFixed(2) : 
        (parseFloat(num1) - parseFloat(num2)).toFixed(2);
    
    currentExercise = {
        num1: num1,
        num2: num2,
        operation: operation,
        correctAnswer: result
    };
    
    document.getElementById('exercise').innerHTML = `
        <p>Calcula: ${num1} ${operation} ${num2}</p>
    `;
    document.getElementById('userAnswer').value = '';
    document.getElementById('result').innerHTML = '';
}

function checkAnswer() {
    const userAnswer = document.getElementById('userAnswer').value.trim();
    const resultDiv = document.getElementById('result');
    
    if (!currentExercise) {
        resultDiv.innerHTML = 'Primero genera un ejercicio';
        return;
    }
    
    if (parseFloat(userAnswer).toFixed(2) === currentExercise.correctAnswer) {
        resultDiv.innerHTML = '¡Correcto!';
        resultDiv.className = 'correct';
    } else {
        resultDiv.innerHTML = `Incorrecto. La respuesta correcta es: ${currentExercise.correctAnswer}`;
        resultDiv.className = 'incorrect';
    }
}

// Generar un ejercicio al cargar la página
generateExercise();