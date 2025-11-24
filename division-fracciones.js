let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const a = Math.floor(Math.random() * 9) + 1;
    const b = Math.floor(Math.random() * 9) + 1;
    const c = Math.floor(Math.random() * 9) + 1;
    const d = Math.floor(Math.random() * 9) + 1;
    
    currentExercise = {
        numerator1: a,
        denominator1: b,
        numerator2: c,
        denominator2: d
    };
    
    // Calcular resultado (a/b ÷ c/d = a/b × d/c)
    const resultNumerator = a * d;
    const resultDenominator = b * c;
    
    // Simplificar la fracción resultante
    const simplified = simplifyFraction(resultNumerator, resultDenominator);
    
    currentExercise.correctAnswer = simplified.denominator === 1 ? 
        simplified.numerator.toString() : 
        `${simplified.numerator}/${simplified.denominator}`;
    
    document.getElementById('exercise').innerHTML = `
        <p>Divide: ${a}/${b} ÷ ${c}/${d}</p>
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

function findMCD(a, b) {
    return b === 0 ? a : findMCD(b, a % b);
}

function simplifyFraction(numerator, denominator) {
    const mcd = findMCD(numerator, denominator);
    return {
        numerator: numerator / mcd,
        denominator: denominator / mcd
    };
}

// Generar un ejercicio al cargar la página
generateExercise();