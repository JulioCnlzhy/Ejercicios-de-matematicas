let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const number = (Math.random() * 100).toFixed(3);
    const decimalPlaces = Math.floor(Math.random() * 3); // 0, 1 o 2 decimales
    const result = parseFloat(number).toFixed(decimalPlaces);
    
    currentExercise = {
        number: number,
        decimalPlaces: decimalPlaces,
        correctAnswer: result
    };
    
    const placeNames = ['unidades', 'décimas', 'centésimas'];
    
    document.getElementById('exercise').innerHTML = `
        <p>Aproxima ${number} a ${decimalPlaces} ${placeNames[decimalPlaces]}</p>
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
    
    if (userAnswer === currentExercise.correctAnswer) {
        resultDiv.innerHTML = '¡Correcto!';
        resultDiv.className = 'correct';
    } else {
        resultDiv.innerHTML = `Incorrecto. La respuesta correcta es: ${currentExercise.correctAnswer}`;
        resultDiv.className = 'incorrect';
    }
}

// Generar un ejercicio al cargar la página
generateExercise();