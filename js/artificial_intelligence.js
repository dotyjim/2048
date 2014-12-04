function ArtificialIntelligence(gameManager) {
  this.gameManager = gameManager;
}

ArtificialIntelligence.prototype.getNextMove(grid) {
  //TODO
  return this.getUtility(grid);
}

ArtificialIntelligence.prototype.getUtility(grid) {
  var total = 0;
  var empty_tiles = 0;
  for (var x in grid) {
    for (var y in grid[x]) {
      if (grid[x][y] == null) {
        empty_tiles++;
      } else {
        total = total + grid[x][y]['value'];
      }
    }
  }
  return total * empty_tiles;
}

ArtificialIntelligence.prototype.start = function() {
  var gameState = this.gameManager.serialize();
  while(!gameState.won) {
    var gameState = this.gameManager.serialize();
    var move = this.getNextMove(gameState.grid);
    this.gameManager.move(move);
    break;
  }
}
