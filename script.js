let humanScore = 0;
let computerScore = 0;
let roundCount = 0;
let winStreak = 0;
let aiCheating = false;
let lastHumanChoice = "";
let chart = null;

const bgMusic = document.getElementById("bgMusic");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");
const audioTie = document.getElementById("audioTie");

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];
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

function playRound(humanChoice) {
  const result = document.getElementById("result");
  const score = document.getElementById("score");
  const streak = document.getElementById("streak");
  const aiStatus = document.getElementById("ai-status");
  const computerChoice = getComputerChoice();

  roundCount++;
  lastHumanChoice = humanChoice;

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
    } else {
      result.textContent = `You lose! ${computerChoice} beats ${humanChoice}`;
      computerScore++;
      winStreak = 0;
      audioLose.play();
      vibrate([400, 100, 100, 100]);
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

function updateChart() {
  if (!chart) {
    const ctx = document.getElementById("chart").getContext("2d");
    chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "You",
            data: [],
            borderColor: "lime",
            tension: 0.3,
          },
          {
            label: "Computer",
            data: [],
            borderColor: "red",
            tension: 0.3,
          },
        ],
      },
    });
  }

  chart.data.labels.push(roundCount);
  chart.data.datasets[0].data.push(humanScore);
  chart.data.datasets[1].data.push(computerScore);
  chart.update();
}

document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  bgMusic.volume = 0.3;
  bgMusic.play();
});

// Keyboard shortcuts
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") playRound("rock");
  if (e.key.toLowerCase() === "p") playRound("paper");
  if (e.key.toLowerCase() === "s") playRound("scissors");
  if (e.key.toLowerCase() === "n") playRound("nuke");
  if (e.key === "Enter") document.getElementById("startBtn").click();
});

// Button click support
document.querySelectorAll(".game-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-choice");
    playRound(choice);
  });
});
