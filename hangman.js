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
let lives;
let word;
let testing;
startBtn.addEventListener('click', getWord);
resetBtn.addEventListener('click', () => { location.reload(); });
function getWord() {
    return __awaiter(this, void 0, void 0, function* () {
        yield fetch('https://random-word-api.herokuapp.com/word')
            .then((response) => response.json())
            .then((response) => (word = response.toString().split('')));
        startBtn.disabled = true;
        lives = 0;
        populateWord();
        populateBoard();
    });
}
function populateWord() {
    word.forEach(function (e) {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        letter.id = e;
        secretWord.append(letter);
    });
}
function populateBoard() {
    let alphabet = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach(function (e) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        guessBoard.append(button);
        button.addEventListener('click', checkLetter);
        testing = document.querySelectorAll('span'); //New stuff in test
    });
}
function checkLetter(e) {
    let check = e.target.innerHTML;
    console.log(check);
}
