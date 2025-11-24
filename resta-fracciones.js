let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    let a, b, c, d;
    
    do {
        a = Math.floor(Math.random() * 9) + 1;
        b = Math.floor(Math.random() * 9) + 1;
        c = Math.floor(Math.random() * 9) + 1;
        d = Math.floor(Math.random() * 9) + 1;
        
        // Asegurar que los denominadores sean diferentes
        if (b === d) d = Math.floor(Math.random() * 9) + 1;
        
        // Asegurar que el resultado sea positivo
        const value1 = a / b;
        const value2 = c / d;
        
        if (value1 > value2) break;
        
    } while (true);
    
    currentExercise = {
        numerator1: a,
        denominator1: b,
        numerator2: c,
        denominator2: d
    };
    
    const mcm = findMCM(currentExercise.denominator1, currentExercise.denominator2);
    const newNumerator1 = currentExercise.numerator1 * (mcm / currentExercise.denominator1);
    const newNumerator2 = currentExercise.numerator2 * (mcm / currentExercise.denominator2);
    const resultNumerator = newNumerator1 - newNumerator2;
    
    // Simplificar la fracción resultante
    const simplified = simplifyFraction(resultNumerator, mcm);
    
    currentExercise.correctAnswer = simplified.denominator === 1 ? 
        simplified.numerator.toString() : 
        `${simplified.numerator}/${simplified.denominator}`;
    
    document.getElementById('exercise').innerHTML = `
        <p>Resuelve: ${currentExercise.numerator1}/${currentExercise.denominator1} - ${currentExercise.numerator2}/${currentExercise.denominator2}</p>
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

function findMCM(a, b) {
    return (a * b) / findMCD(a, b);
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