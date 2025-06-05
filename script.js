const result = document.getElementById("result");
const humanScore = document.querySelector("#my-score");
const machineScore = document.querySelector("#machine-score");
const humanChoiceEl = document.getElementById("human-choice");
const machineChoiceEl = document.getElementById("machine-choice");

// Sons
const soundWin = new Audio("./efeitos/vitoria.wav");
const soundLose = new Audio("./efeitos/derrota.wav");
const soundTie = new Audio("./efeitos/empate.wav");
const soundFinalWin = new Audio("./efeitos/final-big-bang.wav");
const soundFinalLose = new Audio("./efeitos/derrota-final.wav");

// Configuração adicional para sons
soundFinalWin.preload = "auto";
soundFinalWin.volume = 0.8;

// Desbloqueio inicial de áudio com interação do usuário
document.body.addEventListener('click', () => {
    // Toca um som curto para liberar todos os sons
    const unlockSound = new Audio();
    unlockSound.src = "./efeitos/silence.mp3"; // Arquivo opcional de 0.1s de silêncio
    unlockSound.play().catch(() => {});

    // Ou, como alternativa, usamos o próprio som da vitória para desbloquear
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

// Regras do jogo estendido
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

const humanPlayer = (humanChoice) => {
    playtheGame(humanChoice, machinePlayer());
};

const resetGame = () => {
    // Reseta pontuação
    humanScoreNumber = 0;
    machineScoreNumber = 0;
    humanScore.textContent = humanScoreNumber;
    machineScore.textContent = machineScoreNumber;

    // Limpa histórico
    humanHistory = [];

    // Limpa resultados visuais
    result.innerHTML = "";
    result.classList.remove("win", "lose", "tie");

    humanChoiceEl.innerHTML = "";
    machineChoiceEl.innerHTML = "";

    // Remove mensagem de fim de jogo
    const gameOver = document.getElementById("game-over");
    gameOver.classList.remove("show", "win", "lose");
    gameOver.textContent = "";

    // Reativa todos os botões
    document.querySelectorAll("button").forEach(btn => {
        btn.disabled = false;
    });
};

const machinePlayer = () => {
    const choices = ["rock", "paper", "scissors", "lizard", "spock"];

    if (Math.random() < 0.2 && humanHistory.length > 0) {
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

const playtheGame = (human, machine) => {
    const gameOver = document.getElementById("game-over");
    if (gameOver.classList.contains("show")) return;

    // Desativa temporariamente os botões
    document.querySelectorAll("button").forEach(btn => btn.disabled = true);

    result.classList.remove("win", "lose", "tie");
    void result.offsetWidth; // Força reflow para animação

    console.log("Humano: " + human + " Máquina: " + machine);

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
    } else {
        machineScoreNumber++;
        machineScore.textContent = machineScoreNumber;
        result.innerHTML = "😞 Você perdeu! 😞";
        result.classList.add("lose");
        soundLose.play();
    }

    // Reativa os botões após mostrar o resultado
    setTimeout(() => {
        document.querySelectorAll("button").forEach(btn => btn.disabled = false);
    }, 800);

    if (humanScoreNumber >= 5 || machineScoreNumber >= 5) {
        document.querySelectorAll("button").forEach(btn => btn.disabled = true);

        if (humanScoreNumber >= 5) {
            gameOver.textContent = "🎉 Você venceu a partida!";
            gameOver.classList.add("show", "win");

            // Garantir que outros sons parem
            soundFinalLose.pause();
            soundFinalLose.currentTime = 0;

            // Reinicia música
            soundFinalWin.currentTime = 0;

            console.log("Tentando tocar música final...");

            soundFinalWin.play()
                .then(() => {
                    console.log("✅ Música final começou a tocar!");
                })
                .catch(e => {
                    console.error("❌ Erro ao tocar música final:", e);
                });
        } else {
            gameOver.textContent = "😢 A máquina venceu!";
            gameOver.classList.add("show", "lose");
            soundFinalLose.play().catch(e => console.error("Erro ao tocar som final", e));
        }
    }
};