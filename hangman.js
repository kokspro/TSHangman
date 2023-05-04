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
let completeLength;
let toComplete;
let completed;
startBtn.addEventListener('click', getWord);
resetBtn.addEventListener('click', () => { location.reload(); });
function getWord() {
    return __awaiter(this, void 0, void 0, function* () {
        // await fetch('https://random-word-api.herokuapp.com/word')  hard words
        yield fetch('https://random-word-api.vercel.app/api?words=1')
            .then((response) => response.json())
            .then((response) => (word = response.toString().toUpperCase().split('')));
        startBtn.disabled = true;
        lives = 7;
        toComplete = 0;
        completed = 0;
        completeLength = word.length;
        populateWord();
        populateBoard();
    });
}
function populateWord() {
    word.forEach(function (e) {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        secretWord.append(letter);
    });
    testing = document.querySelectorAll('span');
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
    e.target.disabled = true;
    completed = toComplete;
    let check = e.target.innerHTML;
    for (let i = 0; i < word.length; i++) {
        if (check === word[i]) {
            testing[i].textContent = check;
            toComplete++;
            if (toComplete === completeLength) {
                guessBoard.style.display = 'none';
                setTimeout(youWin, 500);
            }
        }
    }
    if (completed === toComplete) {
        lives--;
        hangmanImage.src = `./Images/Hangman${lives}.jpg`;
        if (lives === 0) {
            guessBoard.style.display = 'none';
            setTimeout(youLose, 500);
        }
    }
}
function youWin() {
    alert('Congratulations, YOU WIN!');
}
function youLose() {
    alert('You lose, better luck next time!');
    alert(`You're word was ${word.join('')}!`);
}
