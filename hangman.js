"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
const domElements = {
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
domElements.startBtn.addEventListener('click', disableMode);
domElements.resetBtn.addEventListener('click', () => { location.reload(); });
function disableMode() {
    domElements.mode.forEach(function (radio) {
        radio.disabled = true;
    });
    domElements.startBtn.disabled = true;
    getWord();
}
function getWord() {
    return __awaiter(this, void 0, void 0, function* () {
        if (domElements.mode[0].checked) {
            let wordLength = Math.floor(Math.random() * (9 - 6)) + 7;
            yield fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
                .then((response) => response.json())
                .then((response) => (vars.word = response.toString().toUpperCase().split('')));
        }
        else if (domElements.mode[1].checked)
            yield fetch('https://random-word-api.herokuapp.com/word')
                .then((response) => response.json())
                .then((response) => (vars.word = response.toString().toUpperCase().split('')));
        vars.secretWordLength = vars.word.length;
        populateWord();
        populateBoard();
    });
}
function populateWord() {
    vars.word.forEach(function () {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        fontSize(letter);
        domElements.secretWord.append(letter);
    });
    vars.letterPlaceHolder = document.querySelectorAll('span');
}
function fontSize(letter) {
    if (vars.word.length <= 7)
        letter.style.fontSize = `calc((80vw / ${vars.word.length}) / 1.3)`;
    else
        letter.style.fontSize = `calc((80vw / ${vars.word.length}) / 1.1)`;
}
function populateBoard() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(function (e) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        domElements.guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}
function checkLetter(e) {
    let currentLettersCorrect = vars.lettersCorrect;
    let letterToCheck = e.target.innerHTML;
    e.target.disabled = true;
    e.target.classList.add('selected');
    testLetter(letterToCheck);
    adjustLives(currentLettersCorrect);
}
function testLetter(letterToCheck) {
    for (let i = 0; i < vars.word.length; i++)
        if (letterToCheck === vars.word[i]) {
            vars.letterPlaceHolder[i].textContent = letterToCheck;
            vars.lettersCorrect++;
            if (vars.lettersCorrect === vars.secretWordLength)
                domElements.guessBoard.style.display = 'none';
        }
}
function adjustLives(currentLettersCorrect) {
    if (currentLettersCorrect === vars.lettersCorrect) {
        vars.lives--;
        domElements.hangmanImage.src = `./Images/Hangman${vars.lives}.jpg`;
        if (vars.lives === 0) {
            domElements.guessBoard.style.display = 'none';
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
