function ArtificialIntelligence(gameManager) {
  this.gameManager = gameManager;
  this.depth = 3;
  this.prevMove = null;
}

ArtificialIntelligence.prototype.getNextMove(grid) {
  // Setting up the various move possibilities.
  var PLAYER = 0;
  var RAND = 1;

  var UP = 0;
  var RIGHT = 1;
  var DOWN = 2;
  var LEFT = 3;
  var moves = [UP, DOWN, LEFT, RIGHT];

  // Recursive function that returns optimal action and its utility.
  function recurse(grid, depth, agentIndex, prevMove) {
    if (depth <= 0) {
      return this.getUtility(grid);
    }
    if (agentIndex == PLAYER) {
      var best = (0, UP);
      for (var action in moves) {
        if (action == prevMove) {
          continue;
        }
        var next_grid = this.successor(grid, action);
        var value = recurse(next_grid, depth-1, RAND, action);
        if (value >= best[0]) {
          best = (value, action);
        }
      }
      return best;
    } else { // agentIndex == RAND
      var grid_options = this.getNextGridOptions(grid);
      var best = 0
      for (var grid_option in grid_options) {
        var next_grid, probability = grid_option;
        var value = recurse(next_grid, depth-1, PLAYER, prevMove);
        best = best + value * probability;
      }
      return (best, null);
    }
  }
  value, action = recurse(grid, 2*this.depth, this.prevMove);
  this.prevMove = action;
  return action;
}

ArtificialIntelligence.prototype.successor(grid, action) {

}

ArtificialIntelligence.prototype.getNextGridOptions = function(grid) {
  var grid_options = [];
  var num_availeble_cells = this.getNumAvailableCells(grid);
  for (var x in grid) {
    for (var y in grid[x]) {
      if (grid[x][y] == null) {
        next_grid = this.copyGrid(grid);
        this.addTileToGrid(next_grid, x, y, 2);
        grid_options.push((next_grid, 0.9/num_available_cells));
        next_grid = this.copyGrid(grid);
        this.addTileToGrid(next_grid, x, y, 4);
        grid_options.push((next_grid, 0.1/num_available_cells));
      }
    }
  }
  return grid_options;
}

ArtificialIntelligence.prototype.getNumAvailableCells = function(grid) {
  var num = 0;
  for (var x in grid) {
    for (var y in grid[x]) {
      if (grid[x][y] == null) {
        num++;
      }
    }
  }
  return num;
}

ArtificialIntelligence.prototype.copyGrid = function(grid) {
  var numX = grid.length;
  var numY = grid[0].length;
  var grid_copy = [];
  for (var x in grid) {
    grid_copy.push([]);
    for (var y in grid[x]) {
      grid_copy[x].push({'value': grid[x][y]['value']});
    }
  }
  return grid_copy;
}

ArtificialIntelligence.prototype.addTileToGrid = function(grid, x, y, value) {
  grid[x][y] = {'value': value};
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
