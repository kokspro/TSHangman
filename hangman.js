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
let hangmanImage = document.getElementById('hangmanImage');
let secretWord = document.getElementById('secretWord');
let guessBoard = document.getElementById('guessBoard');
let startBtn = document.getElementById('startBtn');
let resetBtn = document.getElementById('resetBtn');
let mode = document.querySelectorAll('input');
let lives = 7;
let word;
let letterPlaceholder;
let secretWordLength;
let lettersCorrect = 0;
startBtn.addEventListener('click', disableMode);
resetBtn.addEventListener('click', () => { location.reload(); });
function disableMode() {
    mode.forEach(function (radio) {
        radio.disabled = true;
    });
    startBtn.disabled = true;
    getWord();
}
function getWord() {
    return __awaiter(this, void 0, void 0, function* () {
        if (mode[0].checked) {
            let wordLength = Math.floor(Math.random() * (9 - 6)) + 7;
            yield fetch(`https://random-word-api.vercel.app/api?words=1&length=${wordLength}`)
                .then((response) => response.json())
                .then((response) => (word = response.toString().toUpperCase().split('')));
        }
        else if (mode[1].checked)
            yield fetch('https://random-word-api.herokuapp.com/word')
                .then((response) => response.json())
                .then((response) => (word = response.toString().toUpperCase().split('')));
        secretWordLength = word.length;
        populateWord();
        populateBoard();
    });
}
function populateWord() {
    word.forEach(function (e) {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        fontSize(letter);
        secretWord.append(letter);
    });
    letterPlaceholder = document.querySelectorAll('span');
}
function fontSize(letter) {
    if (word.length <= 7)
        letter.style.fontSize = `calc((80vw / ${word.length}) / 1.9)`;
    else
        letter.style.fontSize = `calc((80vw / ${word.length}) / 1.5)`;
}
function populateBoard() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(function (e) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}
function checkLetter(e) {
    let currentLettersCorrect = lettersCorrect;
    let letterToCheck = e.target.innerHTML;
    e.target.disabled = true;
    e.target.classList.add('selected');
    testLetter(letterToCheck);
    adjustLives(currentLettersCorrect);
}
function testLetter(letterToCheck) {
    for (let i = 0; i < word.length; i++)
        if (letterToCheck === word[i]) {
            letterPlaceholder[i].textContent = letterToCheck;
            lettersCorrect++;
            if (lettersCorrect === secretWordLength)
                guessBoard.style.display = 'none';
        }
}
function adjustLives(currentLettersCorrect) {
    if (currentLettersCorrect === lettersCorrect) {
        lives--;
        hangmanImage.src = `./Images/Hangman${lives}.jpg`;
        if (lives === 0) {
            guessBoard.style.display = 'none';
            setTimeout(youLose, 500);
        }
    }
}
function youLose() {
    for (let i = 0; i < word.length; i++)
        if (letterPlaceholder[i].textContent === '_') {
            letterPlaceholder[i].textContent = word[i];
            let missedLetter = letterPlaceholder[i];
            missedLetter.style.color = '#1aa7fc';
        }
}
