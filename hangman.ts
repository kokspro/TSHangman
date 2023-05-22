let hangmanImage = document.getElementById('hangmanImage') as HTMLImageElement;
let secretWord = document.getElementById('secretWord') as HTMLDivElement;
let guessBoard = document.getElementById('guessBoard') as HTMLDivElement;
let startBtn = document.getElementById('startBtn') as HTMLButtonElement;
let resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;
let mode = document.querySelectorAll('input') as NodeListOf<HTMLInputElement>;

let lives: number;
let word: string[];
let testing: NodeList;
let completeLength: number;
let toComplete: number;
let completed: number;

startBtn.addEventListener('click', disableMode);
resetBtn.addEventListener('click', () => { location.reload() });


async function getWord(): Promise<void> {


    if (mode[0].checked) {
        await fetch('https://random-word-api.herokuapp.com/word')
        .then((response) => response.json())
        .then((response) => ( word = response.toString().toUpperCase().split('') ));
    } else if (mode[1].checked) {
        await fetch('https://random-word-api.vercel.app/api?words=1')
        .then((response) => response.json())
        .then((response) => ( word = response.toString().toUpperCase().split('') ));
    }

    lives = 7;
    toComplete = 0;
    completed = 0;
    completeLength = word.length;
    populateWord();
    populateBoard();
}

function disableMode(): void {
    mode.forEach( function(radio: HTMLInputElement) {
        radio.disabled = true;
    });
    startBtn.disabled = true;
    resetBtn.disabled = true;
    getWord();
}

function populateWord(): void { 
    word.forEach( function (e: string) {
        let letter: HTMLSpanElement = document.createElement('span');
        letter.innerHTML = '_';
        secretWord.append(letter);
    });
    testing = document.querySelectorAll('span') as NodeListOf<HTMLSpanElement>;
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
    completed = toComplete;
    let check: string = e.target.innerHTML;
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
function youWin(): void {
    alert('Congratulations, YOU WIN!');
    resetBtn.disabled = false;
}

function youLose(): void {
    alert('You lose, better luck next time!');
    alert(`You're word was ${word.join('')}!`);
    resetBtn.disabled = false;
}

// TODO  Make function to show word with colors different for the letters its showing you
// TODO  Use Color Theme Inverse for loss and selected items

