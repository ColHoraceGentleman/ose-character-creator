// OSE Character Creator — Dice rolling functions

function roll(die) {
  // die format: "3d6", "4d6", "1d8", etc.
  const match = die.match(/(\d+)d(\d+)/);
  if (!match) return 0;
  const [_, num, sides] = match.map(Number);
  let total = 0;
  for (let i = 0; i < num; i++) total += Math.floor(Math.random() * sides) + 1;
  return total;
}

function roll3d6() { return roll("3d6"); }

function roll4d6DropLowest() {
  const rolls = [roll("1d6"), roll("1d6"), roll("1d6"), roll("1d6")];
  rolls.sort((a,b) => a - b);
  return rolls[1] + rolls[2] + rolls[3];
}

function rollHitDie(sides) {
  return roll(`1d${sides}`);
}

function rollStartingGold() {
  return roll("3d6") * 10;
}

// Shuffle array (Fisher-Yates)
function shuffle(array) {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function randomChoice(array) {
  return array[Math.floor(Math.random() * array.length)];
}
