let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const num1 = (Math.random() * 10).toFixed(1);
    const num2 = (Math.random() * 10).toFixed(1);
    const result = (parseFloat(num1) * parseFloat(num2)).toFixed(2);
    
    currentExercise = {
        num1: num1,
        num2: num2,
        correctAnswer: result
    };
    
    document.getElementById('exercise').innerHTML = `
        <p>Multiplica: ${num1} × ${num2}</p>
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