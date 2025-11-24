let currentExercise = null;

document.getElementById('generateExercise').addEventListener('click', generateExercise);
document.getElementById('checkAnswer').addEventListener('click', checkAnswer);

function generateExercise() {
    const exerciseTypes = ['porcentaje', 'proporcion', 'descuento'];
    const type = exerciseTypes[Math.floor(Math.random() * exerciseTypes.length)];
    
    switch(type) {
        case 'porcentaje':
            generatePercentageExercise();
            break;
        case 'proporcion':
            generateProportionExercise();
            break;
        case 'descuento':
            generateDiscountExercise();
            break;
    }
}

function generatePercentageExercise() {
    const number = Math.floor(Math.random() * 200) + 10;
    const percentage = Math.floor(Math.random() * 90) + 10;
    const result = (number * percentage / 100).toFixed(2);
    
    currentExercise = {
        type: 'porcentaje',
        question: `¿Cuánto es el ${percentage}% de ${number}?`,
        correctAnswer: result
    };
    
    displayExercise();
}

function generateProportionExercise() {
    const a = Math.floor(Math.random() * 20) + 2;
    const b = Math.floor(Math.random() * 20) + 2;
    const c = Math.floor(Math.random() * 20) + 2;
    const result = ((b * c) / a).toFixed(2);
    
    currentExercise = {
        type: 'proporcion',
        question: `Si ${a} es a ${b}, ¿cuánto es ${c}?`,
        correctAnswer: result
    };
    
    displayExercise();
}

function generateDiscountExercise() {
    const price = Math.floor(Math.random() * 500) + 50;
    const discount = Math.floor(Math.random() * 40) + 10;
    const finalPrice = (price * (100 - discount) / 100).toFixed(2);
    
    currentExercise = {
        type: 'descuento',
        question: `Un producto cuesta $${price}. Si tiene un ${discount}% de descuento, ¿cuál es el precio final?`,
        correctAnswer: finalPrice
    };
    
    displayExercise();
}

function displayExercise() {
    document.getElementById('exercise').innerHTML = `
        <p>${currentExercise.question}</p>
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