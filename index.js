//console.log("Hello World")

function getComputerChoice(){
    let x = Math.random();
    if(x < 0.33) return "rock";
    else if(x < 0.66) return "paper";
    else return "scissors";
}

//console.log(getComputerChoice())

function getHumanChoice() {
    let choice = prompt("Enter rock, paper, or scissors:").toLowerCase();
    
    while (!['rock', 'paper', 'scissors'].includes(choice)) {
        choice = prompt("Invalid input! Please enter rock, paper, or scissors:").toLowerCase();
    }
    
    return choice;
}

//console.log(getHumanChoice());

let humanScore = 0;
let computerScore = 0;

function playRound(humanChoice, computerChoice) {
    humanChoice = humanChoice.toLowerCase(); 
    if (humanChoice === computerChoice) {
        console.log("It's a tie!");
        return;
    }

    if ((humanChoice === 'rock' && computerChoice === 'scissors') ||
        (humanChoice === 'paper' && computerChoice === 'rock') ||
        (humanChoice === 'scissors' && computerChoice === 'paper')) {
        humanScore++;
        console.log(`You win! ${humanChoice.charAt(0).toUpperCase() + humanChoice.slice(1)} beats ${computerChoice}.`);
    } else {
        computerScore++;
        console.log(`You lose! ${computerChoice.charAt(0).toUpperCase() + computerChoice.slice(1)} beats ${humanChoice}.`);
    }
}

function playGame() {
    for (let i = 0; i < 5; i++) {
        const humanSelection = getHumanChoice(); 
        const computerSelection = getComputerChoice(); 
        
        playRound(humanSelection, computerSelection); 
    }

    console.log(`Final Scores: You: ${humanScore} | Computer: ${computerScore}`);

    if (humanScore > computerScore) {
        console.log("You win the game!");
    } else if (humanScore < computerScore) {
        console.log("You lose the game!");
    } else {
        console.log("It's a tie game!");
    }
}


playGame();



