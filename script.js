//Setting game name
let gameName = "Guess The Word";
document.title = gameName
document.querySelector("h1").innerHTML = gameName;

// Setting game options
let numberOfTries = 5;
let numberOfLetters = 6;
let currentTry = 1;
let numberOfHints = 2;


//manage hints
document.querySelector(".hint span").innerHTML = `(${numberOfHints})`;
const hintButton = document.querySelector(".hint");
hintButton.addEventListener("click",getHint);

//Manage words
let wordToGuess = "";
const words = ["banana", "pickle", "guitar", "bridge", "planet", "castle", "rocket", "forest", "button", "pencil", "garden", "animal", "socket", "window", "school", "camera", "turtle", "bottle", "sunset", "pirate"];
wordToGuess = words[Math.floor(Math.random() * words.length)].toLowerCase();
console.log(wordToGuess);
let messageArea = document.querySelector(".message");

function generateInput() {
    const inputsContainer = document.querySelector(".inputs");

    for (let i = 1; i <= numberOfTries; i++) {
        const tryDiv = document.createElement("div");
        tryDiv.classList.add(`try-${i}`);
        tryDiv.innerHTML = `<span>Try ${i}</span>`;
        if (i !== 1)
            tryDiv.classList.add("disabled-inputs");

        //Create inputs

        for (let j = 1; j <= numberOfLetters; j++) {
            const inputDiv = document.createElement("input");
            inputDiv.type = "text";
            inputDiv.id = `guess-${i}-letter-${j}`
            inputDiv.setAttribute("maxlength", "1");
            tryDiv.appendChild(inputDiv);
        }

        inputsContainer.appendChild(tryDiv);
    }
    inputsContainer.children[0].children[1].focus();


    //Disable the rest inputs
    const inputsInDisableDiv = document.querySelectorAll(".disabled-inputs input");
    inputsInDisableDiv.forEach((input) => (input.disabled = true));
    //Changing letters into uppercase and focus on the next input
    const inputs = document.querySelectorAll("input");
    inputs.forEach((input, index) => {
        input.addEventListener("input", function(){
            this.value = this.value.toUpperCase();
            const nextInput = inputs[index + 1];
            if(nextInput) nextInput.focus();
        })

        //Manage keyboard input movement
        input.addEventListener("keydown", function(event){
            const currentIndex = Array.from(inputs).indexOf(event.target);
            if(event.key === "ArrowRight"){
                const nextInput = currentIndex + 1;
                if(nextInput < inputs.length) inputs[nextInput].focus();
            }

            if(event.key === "ArrowLeft"){
                const prevInput = currentIndex - 1;
                if(prevInput >=0) inputs[prevInput].focus();
            }
        })
    });
}

//Handle check event
const guessButton = document.querySelector(".check");
guessButton.addEventListener("click", handleGuesses);

//Manage Guesses
function handleGuesses(){
    let succcesGuess = true;
    for(let i=1;i<=numberOfLetters;i++){
        const inputField = document.querySelector(`#guess-${currentTry}-letter-${i}`);
        const letter = inputField.value.toLowerCase();
        const actualLetter = wordToGuess[i-1];

        //game logic
        if(letter === actualLetter){
            inputField.classList.add("in-place");
            }else if(wordToGuess.includes(letter) && letter !==""){
                inputField.classList.add("not-in-place");
                succcesGuess = false;
                }else{
                    inputField.classList.add("no");
                    succcesGuess = false;        
        }
    }

    if(succcesGuess){
        messageArea.innerHTML = `Congrtulations You win! The correct word is <span>${wordToGuess}</span>`;
        const currentTryInput = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInput.forEach((input) => input.disabled = true);

        //Disable all inputs
        let allTries = document.querySelectorAll(".inputs > div");
        allTries.forEach((tryDiv) => tryDiv.classList.add("disabled-inputs"));
        
        //disable hint and guess button
        guessButton.disabled = true;
        hintButton.disabled = true;
    }else{
        document.querySelector(`.try-${currentTry}`).classList.add("disabled-inputs");
        const currentTryInput = document.querySelectorAll(`.try-${currentTry} input`);
        currentTryInput.forEach((input) => input.disabled = true);
        currentTry++;
        // document.querySelector(`try-${currentTry}`).classList.remove("disabled-inputs");
        const nextTryInput = document.querySelectorAll(`.try-${currentTry} input`);
        nextTryInput.forEach((input) => (input.disabled = false));
        const el = document.querySelector(`.try-${currentTry}`);
        if(el){
            document.querySelector(`.try-${currentTry}`).classList.remove("disabled-inputs");
            el.children[1].focus();
        }else{
            //disable guess button
            guessButton.disabled = true;

            //disable hint button
            hintButton.disabled = true;

            //Lose message
            messageArea.innerHTML = `You Lose , The word is <span>${wordToGuess}`;
        }
    }
}

function getHint(){
    if(numberOfHints > 0){
        numberOfHints--;
        document.querySelector(".hint span").innerHTML = `(${numberOfHints})`;
    }
    if(numberOfHints === 0){
        hintButton.disabled = true;
    }

    const enabledInputs = document.querySelectorAll(`input:not([disabled])`);
    // console.log(enabledInputs);
    const emptyEnabledInputs = Array.from(enabledInputs).filter((input) => input.value === "");
    // console.log(emptyEnabledInputs);
    if(emptyEnabledInputs.length > 0){
        const randomIndex = Math.floor(Math.random() * emptyEnabledInputs.length);
        //console.log(randomIndex);
        const randomInput = enabledInputs[randomIndex];
        //console.log(randomInput);
        // Find the index of this random input in the whole list of inputs
        const allInputs = document.querySelectorAll("input:not([disabled])");
        const indexToFill = Array.from(allInputs).indexOf(randomInput);
        //console.log(indexToFill);
        
        if(indexToFill !== -1){
            randomInput.value = wordToGuess[indexToFill].toUpperCase();
            randomInput.classList.add("in-place");
        }
    }
}

document.addEventListener("keydown",handleBackSpace);

function handleBackSpace(event){
    if(event.key === "Backspace"){
        const inputs = document.querySelectorAll("input:not([disabled])");
        const currentIndex = Array.from(inputs).indexOf(document.activeElement);
        if(currentIndex > 0){
            const currentInput = inputs[currentIndex];
            const prevInput = inputs[currentIndex - 1];
            if(currentInput.value === ""){
                // Focus previous input and clear its value
                prevInput.focus();
                prevInput.value = "";
            }else{
                currentInput.value = "";
            }
        }
    }
}

window.onload = function () {
    generateInput();
}