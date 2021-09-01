// La cantidad de preguntas seleccionada
let questionsNumber =  document.getElementById("trivia_amount");
//La categoria seleccionada
let category = document.getElementById("trivia_category");
//La dificultad 
let difficulty = document.getElementById("trivia_difficulty");

//El tipo de preguntas (opción multiple o booleana)
let questionType = document.getElementById("trivia_type");

// Los Links que usaremos
const baseLink = "https://opentdb.com/api.php?";
const testLink = "https://opentdb.com/api.php?amount=10";
let currentLink = undefined;//el link que se usa para obtener las preguntas

//El arreglo con las preguntas
let questionArray = [];
// El formulario 
const form1 = document.getElementById("form1");
form1.addEventListener("submit",function(event){
    event.preventDefault();
})

//Generar link 
function generateLink(){
    //numero de preguntas
    let questionIndex = questionsNumber.selectedIndex;
    let questionAmount= questionsNumber.options[questionIndex].value;
    //Categoria 
    let categoryIndex = category.selectedIndex;
    let currentCategory = category.options[categoryIndex].value;
    //Dificultad
    let difficultyIndex = difficulty.selectedIndex;
    let currentDifficulty = difficulty[difficultyIndex].value;
    //Tipo de pregunta(opcion multiple o boolean)
    let typeIndex = questionType.selectedIndex;
    let currentType = questionType[typeIndex].value;
    //El link que usaremos para fetch
    currentLink = `${baseLink}${questionAmount}${currentCategory}${currentDifficulty}${currentType}`;
    console.log(currentLink);
    getFetch(currentLink);
}
//Fin de la funcion

//La funcion que obtiene el arreglo de preguntas ya que tenemos el link
function getFetch(link){
questionArray = [];    
fetch (link)
.then(promise => promise.json())
.then(result => {
    let newArray = result.results;
    for (let i=0;i<newArray.length;i++){
        questionArray.push(newArray[i])    
    }
    console.log(questionArray);
    createQuestion();
  })
  
}
//fin de la funcion
//Funcion que crea html con las preguntas 
//parametros que usaremos
let iQuestion = 0;
let score = 0;
let correctAnswer = undefined;
function createQuestion(){
//Limpiamos el html    
    document.getElementById("question-here").innerHTML = "";
//creamos el parrafo que contiene la pregunta y hacemos append a "question-here"
    const theQuestion = document.createElement("h2");
    theQuestion.innerText = questionArray[iQuestion].question.replace(/&quot;/g, '"');
    theQuestion.innerText = theQuestion.innerText.replace(/&#039;/g, "'");
    document.getElementById("question-here").appendChild(theQuestion);
// se crean las opciones de respuestas 
    //Correcta
    correctAnswer= questionArray[iQuestion].correct_answer.replace(/&#039;/g, "'");
    correctAnswer = correctAnswer.replace(/&quot;/g, "\"");
    correctAnswer = correctAnswer.replace(/"/g, "\"");
    correctAnswer = correctAnswer.replace(/&lt;/g,"<");
    correctAnswer = correctAnswer.replace(/&gt;/g,">");
    correctAnswer = correctAnswer.trim();
    // correctAnswer = `${correctAnswer}`;
    console.log("Right: " + correctAnswer);
    //incorrectas 
    let wrongAnswers = questionArray[iQuestion].incorrect_answers;
    
    
    //Todas las respuestas 
    let allAnswers = [];
    allAnswers.push(correctAnswer)
    for (let i =0;i<wrongAnswers.length;i++){
        allAnswers.push(wrongAnswers[i]);
    }
    allAnswers.sort(function(a, b){return 0.5 - Math.random()});//Cambiamos el orden original por uno al azar
    console.log(allAnswers)
    //creamos los botones para cada repuesta
    const theAnswers =document.createElement("div");
    document.getElementById("question-here").appendChild(theAnswers);
    for (answer in allAnswers){
    let currentAnswer = allAnswers[answer].replace(/&#039;/g, "'");  
    currentAnswer = currentAnswer.toString();
    currentAnswer = currentAnswer.replace(/&quot;/g, "\"");
    currentAnswer = currentAnswer.replace(/"/g, "\"");
    currentAnswer = currentAnswer.replace(/&lt;/g,"<");
    currentAnswer = currentAnswer.replace(/&gt;/g,">");
    currentAnswer = currentAnswer.trim();

    let answerButton = document.createElement("button");
    theAnswers.appendChild(answerButton);
    answerButton.innerHTML = `${currentAnswer}`;
    answerButton.setAttribute("onclick",` checkAnswer("${currentAnswer}"),nextQuestion() `);
    
    // theAnswers.innerHTML += `<button onclick=' checkAnswer("${currentAnswer}") '> ${currentAnswer}</button>`;
    } 
    
//se incrementa el indice para pasar a la siguiente pregunta cuando se vuelva a ejecutar la funcion
    iQuestion++;

    
}
//Fin de funcion

//funcion para revisar si la respuesta es correcta
function checkAnswer(answer){
    if (answer == correctAnswer){
        document.getElementById("question-here").innerHTML = '<img src="./img/right.png" alt="Right!!" class="answerImg">';
        console.log("Correct!!");
        score++;
        console.log("Score "+score);
        yourScore()
    }
    else if (answer != correctAnswer){
        document.getElementById("question-here").innerHTML = '<img src="./img/wrong.png" alt="Wrong!!" class="answerImg">';
        console.log("Wrong!!");
        yourScore();
    }else{nextQuestion();
        score++;
        yourScore();
    }//en caso de que la funcion checkanswer no se ejecute correctamente, se le da al usuario un punto,
    //y se continua con la siguiente pregunta 
}

function hideMenu(){
    document.getElementById("mainDiv").classList.toggle("hidden");
    document.getElementById("question-div").classList.toggle("hidden")
}

function nextQuestion(){
    document.getElementById("button-div").classList.toggle("hidden");
}

// Si ya llegamos a la ultima pregunta se resetea el indice, y la score
function yourScore(){
if (iQuestion >= questionArray.length){
    nextQuestion();
    let finalScore = (score*100)/questionArray.length;
    console.log("Your final score is " + finalScore)
    iQuestion= 0;
    score =0;
        if(finalScore<= 60){
            document.getElementById("question-here").innerHTML = `<p style="color:gold;font-size:x-large">Your Score is ${finalScore}, you can do better! </p>
            <img src="./img/badScore.png" alt=":(" class="answerImg"> <br> <button onclick="hideMenu()" >Play again</button>`;
        }else if (finalScore>60 && finalScore<100){
            document.getElementById("question-here").innerHTML = `<p style="color:gold;font-size:x-large">Your Score is ${finalScore},keep improving! </p>
            <img src="./img/goodScore.png" alt=":)" class="answerImg"> <br> <button onclick="hideMenu()">Play again</button>`;
        }
        else if (finalScore== 100){
            document.getElementById("question-here").innerHTML = `<p style="color:gold;font-size:x-large">Your Score is ${finalScore}, awesome! </p>
            <img src="./img/perfectScore.png" alt=":D" class="answerImg"> <br> <button onclick="hideMenu()" >Play again</button>`;
        }
    }
}