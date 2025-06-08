let difficultyLevel = 1; 
let roundsPlayed = 0;    

function setBackgroundImage() {
    const totalImages = 86;
    const randomNumber = Math.floor(Math.random() * totalImages) + 1;
    const imagePath = `img/BBT${randomNumber}.jpg`;

    const bgContainer = document.getElementById("background-container");
    if (bgContainer) {
        bgContainer.style.opacity = "0";
        setTimeout(() => {
            bgContainer.style.backgroundImage = `url('${imagePath}')`;
            bgContainer.style.opacity = "1";
        }, 300);
    }
}

setBackgroundImage();

const result = document.getElementById("result");
const humanScore = document.querySelector("#my-score");
const machineScore = document.querySelector("#machine-score");
const humanChoiceEl = document.getElementById("human-choice");
const machineChoiceEl = document.getElementById("machine-choice");

const soundWin = new Audio("./efeitos/vitoria.wav");
const soundLose = new Audio("./efeitos/derrota.wav");
const soundTie = new Audio("./efeitos/empate.wav");
const soundFinalWin = new Audio("./efeitos/final-big-bang.wav");
const soundFinalLose = new Audio("./efeitos/derrota-final.wav");

document.body.addEventListener('click', () => {
    const unlockSound = new Audio();
    unlockSound.src = "./efeitos/silence.mp3";
    unlockSound.play().catch(() => {});

    soundFinalWin.play()
        .then(() => {
            soundFinalWin.pause();
            soundFinalWin.currentTime = 0;
        })
        .catch(() => {});
}, { once: true });

let humanScoreNumber = 0;
let machineScoreNumber = 0;
let humanHistory = [];

const rules = {
    rock: ['scissors', 'lizard'],
    paper: ['rock', 'spock'],
    scissors: ['paper', 'lizard'],
    lizard: ['paper', 'spock'],
    spock: ['rock', 'scissors']
};

function getEmoji(choice) {
    switch (choice) {
        case "rock": return "🪨";
        case "paper": return "📃";
        case "scissors": return "✂️";
        case "lizard": return "🦎";
        case "spock": return '<img src="assets/spock.webp" alt="Spock" width="32" height="32">';
        default: return "";
    }
}

function increaseDifficulty() {
    difficultyLevel += 0.5; 
}

const resetGame = () => {
    setBackgroundImage();

    humanScoreNumber = 0;
    machineScoreNumber = 0;
    humanScore.textContent = humanScoreNumber;
    machineScore.textContent = machineScoreNumber;

    humanHistory = [];
    roundsPlayed = 0; 
    difficultyLevel = 1; 

    result.innerHTML = "";
    result.classList.remove("win", "lose", "tie");

    humanChoiceEl.innerHTML = "";
    machineChoiceEl.innerHTML = "";

    const gameOver = document.getElementById("game-over");
    gameOver.classList.remove("show", "win", "lose");
    gameOver.textContent = "";

    document.querySelectorAll("button").forEach(btn => btn.disabled = false);
};

const humanPlayer = (humanChoice) => {
    roundsPlayed++; 
    playtheGame(humanChoice, machinePlayer());
};

const machinePlayer = () => {
    const choices = ["rock", "paper", "scissors", "lizard", "spock"];

    const smartChoiceProbability = Math.min(0.2 + (difficultyLevel - 1) * 0.2, 0.8); 

    if (Math.random() < smartChoiceProbability && humanHistory.length > 0) {
        const lastChoice = humanHistory[humanHistory.length - 1];
        switch (lastChoice) {
            case "rock": return Math.random() < 0.5 ? "paper" : "spock";
            case "paper": return Math.random() < 0.5 ? "scissors" : "lizard";
            case "scissors": return Math.random() < 0.5 ? "rock" : "spock";
            case "lizard": return Math.random() < 0.5 ? "scissors" : "rock";
            case "spock": return Math.random() < 0.5 ? "lizard" : "paper";
            default: return choices[Math.floor(Math.random() * choices.length)];
        }
    }

    return choices[Math.floor(Math.random() * choices.length)];
};

// Função principal do jogo
const playtheGame = (human, machine) => {
    const gameOver = document.getElementById("game-over");
    if (gameOver.classList.contains("show")) return;

    document.querySelectorAll("button").forEach(btn => btn.disabled = true);

    result.classList.remove("win", "lose", "tie");
    void result.offsetWidth;

    humanChoiceEl.innerHTML = getEmoji(human);
    machineChoiceEl.innerHTML = getEmoji(machine);

    humanHistory.push(human);
    if (humanHistory.length > 5) humanHistory.shift();

    if (human === machine) {
        result.innerHTML = "Empatou! 🤝";
        result.classList.add("tie");
        soundTie.play();
    } else if (rules[human].includes(machine)) {
        humanScoreNumber++;
        humanScore.textContent = humanScoreNumber;
        result.innerHTML = "🚀 Você venceu! 🚀";
        result.classList.add("win");
        soundWin.play();

        increaseDifficulty();
    } else {
        machineScoreNumber++;
        machineScore.textContent = machineScoreNumber;
        result.innerHTML = "😞 Você perdeu! 😞";
        result.classList.add("lose");
        soundLose.play();
    }

    setTimeout(() => {
        document.querySelectorAll("button").forEach(btn => btn.disabled = false);
    }, 800);

    if (humanScoreNumber >= 5 || machineScoreNumber >= 5) {
        document.querySelectorAll("button").forEach(btn => btn.disabled = true);

        if (humanScoreNumber >= 5) {
            gameOver.textContent = "🎉 Você venceu a partida!";
            gameOver.classList.add("show", "win");

            soundFinalLose.pause();
            soundFinalLose.currentTime = 0;

            soundFinalWin.currentTime = 0;
            soundFinalWin.play().catch(e => {});
        } else {
            gameOver.textContent = "😢 A máquina venceu!";
            gameOver.classList.add("show", "lose");
            soundFinalLose.play().catch(e => {});
        }
    }
};