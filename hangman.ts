const domElements = {
    hangmanImage: document.getElementById('hangmanImage') as HTMLImageElement,
    secretWord : document.getElementById('secretWord') as HTMLDivElement,
    guessBoard : document.getElementById('guessBoard') as HTMLDivElement,
    startBtn : document.getElementById('startBtn') as HTMLButtonElement,
    resetBtn : document.getElementById('resetBtn') as HTMLButtonElement,
    mode : document.querySelectorAll('input') as NodeListOf<HTMLInputElement>
}

type GameVariables = {
    lives: number,
    word?: string[],
    letterPlaceHolder?: NodeList,
    secretWordLength?: number,
    lettersCorrect: number
}

const vars: GameVariables = {
    lives : 7,
    lettersCorrect : 0
}

domElements.startBtn.addEventListener('click', disableMode);
domElements.resetBtn.addEventListener('click', () => { location.reload() });

function disableMode(): void {
    domElements.mode.forEach( function(radio: HTMLInputElement) {
        radio.disabled = true;
    });
    domElements.startBtn.disabled = true;
    getWord();
}

async function getWord(): Promise<void> {
    if (domElements.mode[0].checked) {
        let wordLength: number = Math.floor(Math.random() * (9 - 6)) + 7;
        await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
        .then((response) => response.json())
        .then((response) => ( vars.word = response.toString().toUpperCase().split('') ));
    } else if (domElements.mode[1].checked) 
        await fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((response) => ( vars.word = response.toString().toUpperCase().split('') )); 

    vars.secretWordLength = vars.word!.length;  
    populateWord();
    populateBoard();
}

function populateWord(): void { 
    vars.word!.forEach( function () {
        let letter: HTMLSpanElement = document.createElement('span');
        letter.innerHTML = '_';
        fontSize(letter);
        domElements.secretWord.append(letter);
    });
    vars.letterPlaceHolder = document.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;  
}

function fontSize(letter: HTMLSpanElement): void {
    if (vars.word!.length <= 7)  
        letter.style.fontSize = `calc((80vw / ${vars.word!.length}) / 1.3)`;  
    else 
        letter.style.fontSize = `calc((80vw / ${vars.word!.length}) / 1.1)`;
}

function populateBoard(): void {
    let alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach( function (e: string) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        domElements.guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}

function checkLetter(e: any): void {
    let currentLettersCorrect: number = vars.lettersCorrect;  
    let letterToCheck: string = e.target.innerHTML;
    e.target.disabled = true;
    e.target.classList.add('selected');
    testLetter(letterToCheck);
    adjustLives(currentLettersCorrect);
}

function testLetter(letterToCheck: string): void {
    for (let i = 0; i < vars.word!.length; i++) 
        if (letterToCheck === vars.word![i]) {
            vars.letterPlaceHolder![i].textContent = letterToCheck; 
            vars.lettersCorrect++;
            if (vars.lettersCorrect === vars.secretWordLength)
                domElements.guessBoard.style.display = 'none';
        } 
}

function adjustLives(currentLettersCorrect: number): void {
    if (currentLettersCorrect === vars.lettersCorrect) {
        vars.lives--;
        domElements.hangmanImage.src = `./Images/Hangman${vars.lives}.jpg`;
        if (vars.lives === 0) {
            domElements.guessBoard.style.display = 'none';
            setTimeout(youLose, 500);
        }
    }
}

function youLose(): void {
    for (let i = 0; i < vars.word!.length; i++)
        if (vars.letterPlaceHolder![i].textContent === '_') {
            vars.letterPlaceHolder![i].textContent = vars.word![i];
            let missedLetter = vars.letterPlaceHolder![i] as HTMLSpanElement;
            missedLetter.style.color = '#1aa7fc';
        }
}


