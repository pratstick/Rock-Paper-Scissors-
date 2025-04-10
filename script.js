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

// 🎵 Audio
const bgMusic = document.getElementById("bgMusic");
const bossMusic = document.getElementById("bossMusic");
const audioWin = document.getElementById("audioWin");
const audioLose = document.getElementById("audioLose");
const audioTie = document.getElementById("audioTie");

function vibrate(pattern) {
  if (navigator.vibrate) navigator.vibrate(pattern);
}

function oneHot(move) {
  if (move === "rock") return [1, 0, 0];
  if (move === "paper") return [0, 1, 0];
  if (move === "scissors") return [0, 0, 1];
  return [0, 0, 0];
}

function counter(move) {
  if (move === "rock") return "paper";
  if (move === "paper") return "scissors";
  return "rock";
}

function hardCounter(choice) {
  return counter(choice);
}

function aiLog(msg) {
  const consoleEl = document.getElementById("aiConsole");
  consoleEl.classList.remove("hidden");
  consoleEl.innerText += `\n${msg}`;
  consoleEl.scrollTop = consoleEl.scrollHeight;
}

function getComputerChoice() {
  const choices = ["rock", "paper", "scissors"];

  // 🔒 Lock win streak
  if (winStreak >= 10 && lastHumanChoice) {
    aiLog("[AI] Win streak exceeded. Initiating shutdown.");
    return hardCounter(lastHumanChoice);
  }

  const smartChance = Math.min(roundCount / 15, 0.9);

  // 🧠 Pattern traps (dual alternating)
  if (humanMoves.length >= 4) {
    const last4 = humanMoves.slice(-4);
    const joined = last4.join("");

    const spamPairs = [
      ["rock", "paper"],
      ["paper", "rock"],
      ["rock", "scissors"],
      ["scissors", "rock"],
      ["paper", "scissors"],
      ["scissors", "paper"],
    ];

    for (const [a, b] of spamPairs) {
      const spam1 = a + b + a + b;
      const spam2 = b + a + b + a;
      if (joined === spam1 || joined === spam2) {
        const expectedNext = humanMoves.at(-1) === a ? b : a;
        aiLog(`[AI] Pattern detected: ${a}-${b} loop → countering ${expectedNext.toUpperCase()}`);
        return hardCounter(expectedNext);
      }
    }
  }

  // Repetition / Alternating bait
  if (roundCount >= 5 && lastHumanChoice && humanMoves.length >= 3) {
    const last3 = humanMoves.slice(-3);
    const allSame = last3.every(m => m === last3[0]);
    const alternating = last3[0] !== last3[1] && last3[0] === last3[2];

    if (alternating && Math.random() < 0.6) {
      aiLog(`[AI] Alternating pattern baited → ${last3[2]} countered`);
      return hardCounter(last3[2]);
    }

    if (allSame && Math.random() < 0.7) {
      aiLog(`[AI] Repetition pattern baited → ${last3[0]} countered`);
      return hardCounter(last3[0]);
    }
  }

  // 🧠 Model prediction
  if (Math.random() < smartChance && model && humanMoves.length >= 10) {
    let input = [];
    for (let i = humanMoves.length - 10; i < humanMoves.length; i++) {
      input.push(...oneHot(humanMoves[i]), ...oneHot(computerMoves[i]));
    }

    const inputTensor = tf.tensor2d([input]);
    const prediction = model.predict(inputTensor);
    const predictedIdx = prediction.argMax(1).dataSync()[0];
    const predictionArray = prediction.dataSync();
    const confidence = Math.max(...predictionArray).toFixed(2);
    const predictedMove = choices[predictedIdx];

    aiLog(`[AI] Prediction: ${predictedMove.toUpperCase()} (${confidence * 100}% confidence)`);
    aiLog(`[AI] Playing counter: ${counter(predictedMove).toUpperCase()}`);

    prediction.dispose();
    return counter(predictedMove);
  }

  // 🎲 Fallback random
  return choices[Math.floor(Math.random() * 3)];
}

// 🎮 Game loop
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

  if (roundCount === 20) {
    bgMusic.pause();
    bossMusic.volume = 0.5;
    bossMusic.play();
  }

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

      // 💥 NUKE FLASH
      if (humanChoice === "nuke") {
        const flash = document.getElementById("flash");
        flash.className = "flash-overlay";
        setTimeout(() => flash.className = "hidden", 600);
        aiLog("[AI] 🔥 Critical hit detected. Recovering systems...");
      }

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

      if (roundCount >= 10) {
        const insults = [
          "Still trying? Cute.",
          "You're not learning, are you?",
          "I predicted that in my sleep.",
          "Strategy? Never heard of it.",
          "Let me know when you're serious.",
          "TAUNT: That was too easy.",
          "TAUNT: Predictable. Try harder.",
        ];
        const insult = insults[Math.floor(Math.random() * insults.length)];
        result.textContent += " 🤖 " + insult;
        aiLog(`[AI] ${insult}`);
      }
    }

    score.textContent = `You: ${humanScore} | Computer: ${computerScore}`;
    streak.textContent = `🔥 Win Streak: ${winStreak}`;

    if (roundCount >= 7 && !aiCheating) {
      aiStatus.textContent = "🤖 AI is learning... Prepare for a challenge!";
      aiCheating = true;

      if (roundCount === 15) {
        const awakening = document.getElementById("aiAwakening");
        awakening.classList.remove("hidden");
        awakening.classList.add("glitch-text");
        document.getElementById("gameArea").classList.add("shake");

        setTimeout(() => {
          awakening.classList.remove("glitch-text");
          document.getElementById("gameArea").classList.remove("shake");
        }, 15000);
      }

      aiLog("[AI] Initializing memory...");
      setTimeout(() => aiLog("[AI] Analyzing human pattern..."), 1000);
      setTimeout(() => aiLog("[AI] Detecting alternating strategy..."), 2500);
      setTimeout(() => aiLog("[AI] Counter strategy deployed."), 4000);
      setTimeout(() => aiLog("[AI] Prediction accuracy: 97.2%"), 6000);
    }

    updateChart();
  }, 250);
}

// 📈 Stats Chart
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

// 🎮 Game start
document.getElementById("startBtn").addEventListener("click", () => {
  document.getElementById("gameArea").classList.remove("hidden");
  document.getElementById("startBtn").classList.add("hidden");
  bgMusic.volume = 0.3;
  bgMusic.play();
});

// ⌨️ Keyboard support
window.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "r") playRound("rock");
  if (e.key.toLowerCase() === "p") playRound("paper");
  if (e.key.toLowerCase() === "s") playRound("scissors");
  if (e.key.toLowerCase() === "n") playRound("nuke");
  if (e.key === "Enter") document.getElementById("startBtn").click();
});

// 🖱️ Click support
document.querySelectorAll(".game-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const choice = btn.getAttribute("data-choice");
    playRound(choice);
  });
});
