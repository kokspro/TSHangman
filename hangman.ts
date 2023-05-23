let hangmanImage = document.getElementById('hangmanImage') as HTMLImageElement;
let secretWord = document.getElementById('secretWord') as HTMLDivElement;
let guessBoard = document.getElementById('guessBoard') as HTMLDivElement;
let startBtn = document.getElementById('startBtn') as HTMLButtonElement;
let resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
let mode = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

let lives: number = 7;
let word: string[];
let letterPlaceholder: NodeList;
let secretWordLength: number;
let lettersLeft: number = 0;
let lettersCorrect: number = 0;

startBtn.addEventListener('click', disableMode);
resetBtn.addEventListener('click', () => { location.reload() });

async function getWord(): Promise<void> {
    if (mode[0].checked) {
        await fetch('https://random-word-api.vercel.app/api?words=1')
        .then((response) => response.json())
        .then((response) => ( word = response.toString().toUpperCase().split('') ));
    } else if (mode[1].checked) {
        await fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((response) => ( word = response.toString().toUpperCase().split('') ));
    }

    secretWordLength = word.length;
    populateWord();
    populateBoard();
}

function disableMode(): void {
    mode.forEach( function(radio: HTMLInputElement) {
        radio.disabled = true;
    });
    startBtn.disabled = true;
    getWord();
}

function populateWord(): void { 
    word.forEach( function (e: string) {
        let letter: HTMLSpanElement = document.createElement('span');
        letter.innerHTML = '_';
        if (word.length <= 6) {
            letter.style.fontSize = `calc((100vw / ${word.length}) / 1.5)`;
        } else {
            letter.style.fontSize = `calc(100vw / ${word.length})`;
        }
        secretWord.append(letter);
    });
    letterPlaceholder = document.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;
}

function populateBoard(): void {
    let alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach( function (e: string) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        guessBoard.append(button);
        button.addEventListener('click', checkLetter);
    });
}

function checkLetter(e: any): void {
    e.target.disabled = true;
    e.target.classList.add('selected');
    lettersCorrect = lettersLeft;
    let letterToCheck: string = e.target.innerHTML;
    for (let i = 0; i < word.length; i++) {
        if (letterToCheck === word[i]) {
            letterPlaceholder[i].textContent = letterToCheck; 
            lettersLeft++;
            if (lettersLeft === secretWordLength) {
                guessBoard.style.display = 'none';
                setTimeout(youWin, 500);
            }
        } 
    }
    if (lettersCorrect === lettersLeft) {
        lives--;
        hangmanImage.src = `./Images/Hangman${lives}.jpg`;
        if (lives === 0) {
            guessBoard.style.display = 'none';
            setTimeout(youLose, 500);
        }
    }
}
function youWin(): void {
    alert('Congratulations, YOU WIN!');
}

function youLose(): void {
    for (let i = 0; i < word.length; i++) {
        if (letterPlaceholder[i].textContent === '_') {
            letterPlaceholder[i].textContent = word[i];
            let missedLetter = letterPlaceholder[i] as HTMLSpanElement;
            missedLetter.style.color = '#1aa7fc';
        }
    }
}
