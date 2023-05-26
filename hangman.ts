// let hangmanImage = document.getElementById('hangmanImage') as HTMLImageElement;
// let secretWord = document.getElementById('secretWord') as HTMLDivElement;
// let guessBoard = document.getElementById('guessBoard') as HTMLDivElement;
// let startBtn = document.getElementById('startBtn') as HTMLButtonElement;
// let resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
// let mode = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;
// let lives: number = 7; 
// let word: string[];
// let letterPlaceholder: NodeList; 
// let secretWordLength: number; 
// let lettersCorrect: number = 0;

const dom = {
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

dom.startBtn.addEventListener('click', disableMode);
dom.resetBtn.addEventListener('click', () => { location.reload() });

function disableMode(): void {
    dom.mode.forEach( function(radio: HTMLInputElement) {
        radio.disabled = true;
    });
    dom.startBtn.disabled = true;
    getWord();
}

async function getWord(): Promise<void> {
    if (dom.mode[0].checked) {
        let wordLength: number = Math.floor(Math.random() * (9 - 6)) + 7;
        await fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
        .then((response) => response.json())
        .then((response) => ( vars.word = response.toString().toUpperCase().split('') )); //variables
    } else if (dom.mode[1].checked) 
        await fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((response) => ( vars.word = response.toString().toUpperCase().split('') )); //variables

    vars.secretWordLength = vars.word!.length;  //variables 2 ? 1
    populateWord();
    populateBoard();
}

function populateWord(): void { 
    vars.word!.forEach( function (e: string) {  //variables ?
        let letter: HTMLSpanElement = document.createElement('span');
        letter.innerHTML = '_';
        fontSize(letter);
        dom.secretWord.append(letter);
    });
    vars.letterPlaceHolder = document.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;  //variables
}

function fontSize(letter: HTMLSpanElement): void {
    if (vars.word!.length <= 7)  //variables ?
        letter.style.fontSize = `calc((80vw / ${vars.word!.length}) / 1.9)`;  //variables ?
    else 
        letter.style.fontSize = `calc((80vw / ${vars.word!.length}) / 1.1)`; // variables ?   took out / 1.5 at end
}

function populateBoard(): void {
    let alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach( function (e: string) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        dom.guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}

function checkLetter(e: any): void {
    let currentLettersCorrect: number = vars.lettersCorrect;  //variables
    let letterToCheck: string = e.target.innerHTML;
    e.target.disabled = true;
    e.target.classList.add('selected');
    testLetter(letterToCheck);
    adjustLives(currentLettersCorrect);
}

function testLetter(letterToCheck: string): void {
    for (let i = 0; i < vars.word!.length; i++)  //variables !
        if (letterToCheck === vars.word![i]) {
            vars.letterPlaceHolder![i].textContent = letterToCheck; 
            vars.lettersCorrect++;
            if (vars.lettersCorrect === vars.secretWordLength)
                dom.guessBoard.style.display = 'none';
        } 
}

function adjustLives(currentLettersCorrect: number): void {
    if (currentLettersCorrect === vars.lettersCorrect) {
        vars.lives--;
        dom.hangmanImage.src = `./Images/Hangman${vars.lives}.jpg`;
        if (vars.lives === 0) {
            dom.guessBoard.style.display = 'none';
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