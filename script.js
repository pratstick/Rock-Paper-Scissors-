let humanScore = 0;
let computerScore = 0;
let roundCount = 0;
let winStreak = 0;
let aiCheating = false;
let lastHumanChoice = "";
let chart = null;

// 🧠 AI model
let model;
let humanMoves = [];
let computerMoves = [];

async function loadModel() {
  model = await tf.loadLayersModel("model/model.json");
  console.log("🧠 Smart AI model loaded");
}
loadModel();

// Audio & music
const bgMusic = document.getElementById("bgMusic");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");
const audioTie = document.getElementById("audioTie");

// Vibration support
function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

// One-hot encoding
function oneHot(move) {
  if (move === 'rock') return [1, 0, 0];
  if (move === 'paper') return [0, 1, 0];
  if (move === 'scissors') return [0, 0, 1];
  return [0, 0, 0];
}

function counter(move) {
  if (move === 'rock') return 'paper';
  if (move === 'paper') return 'scissors';
  if (move === 'scissors') return 'rock';
}

// 😈 Evil AI logic
function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];

  // 🔥 Anti-win-streak cheat
  if (winStreak >= 10 && lastHumanChoice) {
    console.log("💀 Cheating activated: Preventing win streak");
    return hardCounter(lastHumanChoice);
  }

  // 🧠 Smart prediction
  if (aiCheating && model && humanMoves.length >= 5) {
    let input = [];
    for (let i = humanMoves.length - 5; i < humanMoves.length; i++) {
      input.push(...oneHot(humanMoves[i]), ...oneHot(computerMoves[i]));
    }

    const inputTensor = tf.tensor2d([input]);
    const prediction = model.predict(inputTensor);
    const predictedIdx = prediction.argMax(1).dataSync()[0];
    prediction.dispose();

    const predictedHumanMove = choices[predictedIdx];
    return counter(predictedHumanMove);
  }

  // 🥷 Fallback cheat logic
  if (aiCheating && roundCount >= 7) {
    return hardCounter(lastHumanChoice);
  }

  return choices[Math.floor(Math.random() * choices.length)];
}

function hardCounter(choice) {
  if (choice === "rock") return "paper";
  if (choice === "paper") return "scissors";
  return "rock";
}

// 🔄 Game loop
function playRound(humanChoice) {
  const result = document.getElementById("result");
  const score = document.getElementById("score");
  const streak = document.getElementById("streak");
  const aiStatus = document.getElementById("ai-status");

  const computerChoice = getComputerChoice();
  lastHumanChoice = humanChoice;
  humanMoves.push(humanChoice);
  computerMoves.push(computerChoice);
  roundCount++;

  setTimeout(() => {
    if (humanChoice === computerChoice) {
      result.textContent = `It's a tie! Both chose ${humanChoice}`;
      audioTie.play();
      vibrate(100);
    } else if (
      (humanChoice === "rock" && computerChoice === "scissors") ||
      (humanChoice === "paper" && computerChoice === "rock") ||
      (humanChoice === "scissors" && computerChoice === "paper") ||
      humanChoice === "nuke"
    ) {
      result.textContent = `You win! ${humanChoice} beats ${computerChoice}`;
      humanScore++;
      winStreak++;
      audioWin.play();
      vibrate([200, 100, 200]);

      // 🧢 Fake encouragement
      if (winStreak >= 7 && winStreak < 10) {
        const fakes = [
          "You're on fire! 🔥",
          "Wow, you're really good at this!",
          "AI is impressed... for now.",
          "This might be your big moment...",
        ];
        result.textContent += " 🤖 " + fakes[Math.floor(Math.random() * fakes.length)];
      }

    } else {
      result.textContent = `You lose! ${computerChoice} beats ${humanChoice}`;
      computerScore++;
      winStreak = 0;
      audioLose.play();
      vibrate([400, 100, 100, 100]);

      // 😏 Sarcasm
      if (roundCount >= 10) {
        const insults = [
          "Still trying? Cute.",
          "You're not learning, are you?",
          "I predicted that in my sleep.",
          "Strategy? Never heard of it.",
          "Let me know when you're serious.",
        ];
        result.textContent += " 🤖 " + insults[Math.floor(Math.random() * insults.length)];
      }

      // 💣 Anti-streak shutdown
      if (winStreak >= 10) {
        result.textContent += " 💀 Streak ended. Order restored.";
      }
    }

    score.textContent = `You: ${humanScore} | Computer: ${computerScore}`;
    streak.textContent = `🔥 Win Streak: ${winStreak}`;

    if (roundCount >= 7 && !aiCheating) {
      aiStatus.textContent = "🤖 AI is learning... Prepare for a challenge!";
      aiCheating = true;
    }

    updateChart();
  }, 250);
}

// 📈 Chart setup
function updateChart() {
  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          { label: "You", data: [], borderColor: "lime", tension: 0.3 },
          { label: "Computer", data: [], borderColor: "red", tension: 0.3 },
        ],
      },
    });
  }

  chart.data.labels.push(roundCount);
  chart.data.datasets[0].data.push(humanScore);
  chart.data.datasets[1].data.push(computerScore);
  chart.update();
}

// 🚀 Game start
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  bgMusic.volume = 0.3;
  bgMusic.play();
});

// ⌨️ Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") playRound("rock");
  if (e.key.toLowerCase() === "p") playRound("paper");
  if (e.key.toLowerCase() === "s") playRound("scissors");
  if (e.key.toLowerCase() === "n") playRound("nuke");
  if (e.key === "Enter") document.getElementById("startBtn").click();
});

// 🖱️ Button click support
document.querySelectorAll(".game-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-choice");
    playRound(choice);
  });
});
