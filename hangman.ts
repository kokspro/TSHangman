let hangmanImage = document.getElementById('hangmanImage') as HTMLImageElement;
let secretWord = document.getElementById('secretWord') as HTMLDivElement;
let guessBoard = document.getElementById('guessBoard') as HTMLDivElement;
let startBtn = document.getElementById('startBtn') as HTMLButtonElement;
let resetBtn = document.getElementById('resetBtn') as HTMLButtonElement;

let lives: number;
let word: string[];
let testing;

startBtn.addEventListener('click', getWord);
resetBtn.addEventListener('click', () => { location.reload() });


async function getWord(): Promise<void> {
    await fetch('https://random-word-api.herokuapp.com/word')
    .then((response) => response.json())
    .then((response) => ( word = response.toString().split('') ));
    startBtn.disabled = true;
    lives = 0;
    populateWord();
    populateBoard();
}

 function populateWord(): void { 
    word.forEach( function (e: string) {
        let letter = document.createElement('span');
        letter.innerHTML = '_';
        letter.id = e;
        secretWord.append(letter);
    });
}

function populateBoard(): void {
    let alphabet: string[] = 'abcdefghijklmnopqrstuvwxyz'.split('');
    alphabet.forEach( function (e: string) {
        let button = document.createElement('button');
        button.innerHTML = e.toUpperCase();
        guessBoard.append(button);
        button.addEventListener('click', checkLetter);
        testing = document.querySelectorAll('span');  //New stuff in test
    });
}

function checkLetter(e: any): void {
    let check = e.target.innerHTML;
    console.log(check);
    
}


