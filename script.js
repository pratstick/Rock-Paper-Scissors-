let humanScore = 0;
let computerScore = 0;
let winStreak = 0;
let rounds = 0;
let humanMoves = { rock: 0, paper: 0, scissors: 0 };
let chart;

// Audio
const bgMusic = document.getElementById("bgMusic");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");
const audioTie = document.getElementById("audioTie");

const startBtn = document.getElementById("startBtn");
const gameArea = document.getElementById("gameArea");

startBtn.addEventListener("click", startGame);

document.querySelectorAll(".game-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const choice = btn.dataset.choice;
    playRound(choice);
  });
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Enter") startGame();
  if (!gameArea.classList.contains("hidden")) {
    if (e.key.toLowerCase() === "r") playRound("rock");
    else if (e.key.toLowerCase() === "p") playRound("paper");
    else if (e.key.toLowerCase() === "s") playRound("scissors");
    else if (e.key.toLowerCase() === "n") playRound("nuke");
  }
});

function startGame() {
  humanScore = 0;
  computerScore = 0;
  winStreak = 0;
  rounds = 0;
  humanMoves = { rock: 0, paper: 0, scissors: 0 };
  startBtn.classList.add("hidden");
  gameArea.classList.remove("hidden");
  bgMusic.volume = 0.2;
  bgMusic.play();
  updateChart();
  updateUI();
}

function playRound(humanChoice) {
  if (!["rock", "paper", "scissors", "nuke"].includes(humanChoice)) return;
  if (humanChoice !== "nuke") humanMoves[humanChoice]++;
  const compChoice = getComputerChoice();

  let resultText = '';
  let win = false;

  if (humanChoice === "nuke") {
    resultText = "💥 You nuked the AI! You win the round!";
    humanScore++;
    win = true;
  } else if (humanChoice === compChoice) {
    resultText = `🤝 Tie! You both chose ${compChoice}`;
    audioTie.play();
    winStreak = 0;
  } else if (
    (humanChoice === 'rock' && compChoice === 'scissors') ||
    (humanChoice === 'paper' && compChoice === 'rock') ||
    (humanChoice === 'scissors' && compChoice === 'paper')
  ) {
    resultText = `✅ You win! ${humanChoice} beats ${compChoice}`;
    audioWin.play();
    humanScore++;
    win = true;
    winStreak++;
  } else {
    resultText = `❌ You lose! ${compChoice} beats ${humanChoice}`;
    audioLose.play();
    computerScore++;
    winStreak = 0;
  }

  rounds++;
  updateUI(resultText);
  updateChart();
  if (win) triggerConfetti();
}

function getComputerChoice() {
  if (rounds >= 7) {
    const top = Object.entries(humanMoves).sort((a, b) => b[1] - a[1])[0][0];
    if (top === 'rock') return 'paper';
    if (top === 'paper') return 'scissors';
    return 'rock';
  }
  return ["rock", "paper", "scissors"][Math.floor(Math.random() * 3)];
}

function updateUI(message = '') {
  document.getElementById("result").textContent = message;
  document.getElementById("score").textContent = `You: ${humanScore} | Computer: ${computerScore}`;
  document.getElementById("streak").textContent = winStreak > 1 ? `🔥 Win Streak: ${winStreak}` : '';
  document.getElementById("ai-status").textContent = rounds >= 7 ? "👾 AI Boss Mode Activated" : '';
}

function updateChart() {
  const ctx = document.getElementById("chart").getContext("2d");
  if (chart) chart.destroy();
  chart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Rock', 'Paper', 'Scissors'],
      datasets: [{
        label: 'Your Move Usage',
        data: [humanMoves.rock, humanMoves.paper, humanMoves.scissors],
        backgroundColor: ['#f87171', '#60a5fa', '#fbbf24'],
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: false,
      plugins: { legend: { display: false } },
      scales: {
        y: { ticks: { color: '#fff' }, beginAtZero: true },
        x: { ticks: { color: '#fff' } }
      }
    }
  });
}

// 🎉 Confetti Effect (simplified)
function triggerConfetti() {
  const canvas = document.getElementById('confetti-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const pieces = Array.from({ length: 150 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 8 + 2,
    color: `hsl(${Math.random() * 360}, 100%, 50%)`,
    dy: Math.random() * 4 + 1,
    dx: Math.random() * 4 - 2
  }));

  let frame = 0;
  function draw() {
    if (frame > 50) return ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pieces.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.fillRect(p.x, p.y, p.size, p.size);
      p.y += p.dy;
      p.x += p.dx;
    });
    frame++;
    requestAnimationFrame(draw);
  }

  draw();
}
