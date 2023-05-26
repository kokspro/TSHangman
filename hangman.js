"use strict";
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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const dom = {
    hangmanImage: document.getElementById('hangmanImage'),
    secretWord: document.getElementById('secretWord'),
    guessBoard: document.getElementById('guessBoard'),
    startBtn: document.getElementById('startBtn'),
    resetBtn: document.getElementById('resetBtn'),
    mode: document.querySelectorAll('input')
};
const vars = {
    lives: 7,
    lettersCorrect: 0
};
dom.startBtn.addEventListener('click', disableMode);
dom.resetBtn.addEventListener('click', () => { location.reload(); });
function disableMode() {
    dom.mode.forEach(function (radio) {
        radio.disabled = true;
    });
    dom.startBtn.disabled = true;
    getWord();
}
function getWord() {
    return __awaiter(this, void 0, void 0, function* () {
        if (dom.mode[0].checked) {
            let wordLength = Math.floor(Math.random() * (9 - 6)) + 7;
            yield fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
                .then((response) => response.json())
                .then((response) => (vars.word = response.toString().toUpperCase().split(''))); //variables
        }
        else if (dom.mode[1].checked)
            yield fetch('https://random-word-api.herokuapp.com/word')
                .then((response) => response.json())
                .then((response) => (vars.word = response.toString().toUpperCase().split(''))); //variables
        vars.secretWordLength = vars.word.length; //variables 2 ? 1
        populateWord();
        populateBoard();
    });
}
function populateWord() {
    vars.word.forEach(function (e) {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        fontSize(letter);
        dom.secretWord.append(letter);
    });
    vars.letterPlaceHolder = document.querySelectorAll('span'); //variables
}
function fontSize(letter) {
    if (vars.word.length <= 7) //variables ?
        letter.style.fontSize = `calc((80vw / ${vars.word.length}) / 1.9)`; //variables ?
    else
        letter.style.fontSize = `calc((80vw / ${vars.word.length}) / 1.5)`; // variables ?
}
function populateBoard() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(function (e) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        dom.guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}
function checkLetter(e) {
    let currentLettersCorrect = vars.lettersCorrect; //variables
    let letterToCheck = e.target.innerHTML;
    e.target.disabled = true;
    e.target.classList.add('selected');
    testLetter(letterToCheck);
    adjustLives(currentLettersCorrect);
}
function testLetter(letterToCheck) {
    for (let i = 0; i < vars.word.length; i++) //variables !
        if (letterToCheck === vars.word[i]) {
            vars.letterPlaceHolder[i].textContent = letterToCheck;
            vars.lettersCorrect++;
            if (vars.lettersCorrect === vars.secretWordLength)
                dom.guessBoard.style.display = 'none';
        }
}
function adjustLives(currentLettersCorrect) {
    if (currentLettersCorrect === vars.lettersCorrect) {
        vars.lives--;
        dom.hangmanImage.src = `./Images/Hangman${vars.lives}.jpg`;
        if (vars.lives === 0) {
            dom.guessBoard.style.display = 'none';
            setTimeout(youLose, 500);
        }
    }
}
function youLose() {
    for (let i = 0; i < vars.word.length; i++)
        if (vars.letterPlaceHolder[i].textContent === '_') {
            vars.letterPlaceHolder[i].textContent = vars.word[i];
            let missedLetter = vars.letterPlaceHolder[i];
            missedLetter.style.color = '#1aa7fc';
        }
}
