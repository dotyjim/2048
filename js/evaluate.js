var fs = require('fs');
var vm = require('vm');
function include(path) {
  var code = fs.readFileSync(path, 'utf-8');
  vm.runInThisContext(code, path);
}

include('tile.js')
include('grid.js');
include('game_manager.js');
include('artificial_intelligence.js')

var win = 0;
var lose = 0;
var scores = []
var numPlays = 100;
var total = 0;
var count = 0;

for (var i = 0; i < numPlays; i++) {
  var gameManager = new GameManager(4, null, null, null);
  var artificialIntelligence = new ArtificialIntelligence(gameManager, 'expectimax');
  while (!gameManager.isGameTerminated()) {
    artificialIntelligence.run();
  }
  scores.push(gameManager.score);
  total += gameManager.score;
  count += 1;
  if (gameManager.won) {
    win += 1;
  } else {
    lose += 1;
  }
  console.log('score:' + gameManager.score + ', wins: ' + win + ', loses: ' + lose + ', avg: ' + (total/count));
}

var avg = 0;
scores.forEach(function(item) { avg += item; });
var avg = avg/scores.length
console.log('Num played: ' + numPlays);
console.log('Avg Score: ' + avg);
console.log('Wins: ' + win);
console.log('Loses: ' + lose);
