/* 1. Deposit +
   2. Determine number of lines +
   3. Collect bet amount +
   4. Spin the slots +
   5. Check if user won +
   6. Give user winnings +
   7. Play again +
*/

const prompt = require("prompt-sync")();

const ROWS = 3;
const COLS = 3;

const SYMBOLS_COUNT = {
    A: 2,
    B: 6,
    C: 4,
    D: 8,
}

const SYMBOL_VALUES = {
    A: 10,
    B: 5,
    C: 1,
    D: 3,
}

const getDeposit = () => {
    while (true){
        const depositAmount = prompt("Enter deposit: ");
        const numberDepositAmount = parseFloat(depositAmount);
        if(isNaN(numberDepositAmount) || numberDepositAmount <= 0){
            console.log("Invalid deposit amount, please try again.");
        } else{
            return numberDepositAmount;
        }
    }
};

const getNumberOfLines = () => {
    while (true){
        const lines = prompt("Enter the number of lines (1-3): ");
        const numberOfLines = parseFloat(lines);
        if(isNaN(numberOfLines) || numberOfLines < 1 || numberOfLines > 3){
            console.log("Invalid number of lines, please try again.");
        } else{
            return numberOfLines;
        }
    }
};

const getBet = (Balance) => {
    while (true){
        const Bet = prompt("Enter the bet per line: ");
        const numberBet = parseFloat(Bet);
        if(isNaN(numberBet) || numberBet <= 0 || numberBet > Balance / getNumberOfLines){
            console.log("Invalid bet, please try again.");
        } else{
            return numberBet;
        }
    }
};

const Spin = () => {
    const symbols = [];
    for (const [symbol, count] of Object.entries(SYMBOLS_COUNT)){
        for(let i = 0; i < count; i++){
            symbols.push(symbol);
        }
    }

    const reels = [];
    for(let i = 0; i < COLS; i++){
        reels.push([]);
        const reelSymbols = [...symbols];
            for(let j = 0; j < ROWS; j++){
                const randomIndex = Math.floor(Math.random() * reelSymbols.length);
                const selectedSymbol = reelSymbols[randomIndex];
                reels[i].push(selectedSymbol);
                reelSymbols.splice(randomIndex, 1);
            }
    }
    return reels;
};

const transpose = (reels) => {
    const rows = [];
    for(let i = 0; i < ROWS; i++){
        rows.push([]);
        for(let j = 0; j < COLS; j++){
            rows[i].push(reels[j][i]);
        }
    }
    return rows;
};

const printRows = (rows) => {
    for(const row of rows) {
        let rowString = "";
        for(const [i, symbol] of row.entries()) {
            rowString += symbol;
            if(i != row.length - 1) {
                rowString += " | ";
            }
        }
        console.log(rowString);
    }
};

const getWinnings = (rows, Bet, lines) => {
    let winnings = 0;
    for(let row = 0; row < lines; row++) {
        const symbols = rows[row];
        let allSame = true;

        for(const symbol of symbols){
            if(symbols[0] != symbol) {
                allSame = false;
                break;
            }
        }

        if(allSame) {
            winnings += Bet * SYMBOL_VALUES[symbols[0]]
        }

    }

    return winnings;
};

const game = () => {
    let Balance = getDeposit();

    while(true){
        console.log("Balance: $" + Balance)
        const numberOfLines = getNumberOfLines();
        const Bet = getBet(Balance, numberOfLines);
        Balance -= Bet * numberOfLines;
        const reels = Spin();
        const rows = transpose(reels);
        printRows(rows);
        const winnings = getWinnings(rows, Bet, numberOfLines);
        Balance += winnings;
        console.log("You won, $" + winnings.toString());

        if(Balance <= 0){
            console.log("You lost all your money, game over");
            break;
        }

        const playAgain = prompt("Do you want to play again (y/n)");

        if(playAgain != "y") break;
    }
};

game();