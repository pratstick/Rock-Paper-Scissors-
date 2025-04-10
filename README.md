# 🕹️ Rock Paper Scissors: Arcade AI Showdown

> A retro 8-bit Rock Paper Scissors game where the AI learns, taunts, and crushes you — eventually.  
> Built with ❤️ using HTML, TailwindCSS, TensorFlow.js, Chart.js & pure chaos.

---

## 👾 Features

- 🎨 **8-bit arcade-style UI** powered by TailwindCSS + pixel fonts
- 🧠 **Smart AI opponent** using a trained TensorFlow.js model
- 📈 **Real-time stats** with Chart.js line graph
- 🤖 **AI pattern detection** (spam traps, alternators, loop breakers)
- 😈 **Progressive difficulty** (AI becomes unbeatable past round 15)
- 💬 **Sarcastic insults** and taunts when you lose
- 💣 **"Nuke" move** with a full-screen CRT flash effect
- 🧠 **AI console log** shows predictions, traps & snark
- 🔊 **Background music** + win/lose/tie sound effects
- 📱 **Mobile-friendly layout** + keyboard shortcuts

---

## 🚀 Gameplay

- **R** = 🪨 Rock  
- **P** = 📄 Paper  
- **S** = ✂️ Scissors  
- **N** = 💣 Nuke (win anything, but AI hates it)

---

## AI Details

The AI uses a **pre-trained neural network** via TensorFlow.js and combines that with:

- Spam loop detection (`rock-paper-rock-paper`)
- Alternator baiting (`rock → paper → rock`)
- Repetition counters (`rock rock rock`)
- Win streak lockouts after 10 wins
- Confidence-based predictions with live logs

---

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/pratstick/Rock-Paper-Smart.git
   cd Rock-Paper-Smart
2. Serve locally (optional but recommended for audio):
   ```bash
   npx serve
3. Or just open index.html in browser      

---

## Folder Structure
/music/               All audio files
/model/               AI model (model.json + weights)
index.html            Game UI
script.js             Game logic
README.md             You're here!

---

## AI Training (optional)
If you're interested in the training script (train_smart_rps_ai.py), it uses:

    PyTorch or TensorFlow

    Simulated spammy players + random input

    Converts and exports model to model/model.json

---

## Built With
TailwindCSS

TensorFlow.js

Chart.js

Vanilla JS, HTML5, and the spirit of the 80s 

---

## License

Code released under the MIT License.
Feel free to remix, fork, add a boss fight, or turn this into an AI dojo.

---

## Developer Note

    "The machine learns... and mocks you for it."

Built for fun. Break it. Hack it. Outsmart it. Or let it destroy you with style.