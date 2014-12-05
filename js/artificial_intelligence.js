function ArtificialIntelligence(gameManager) {
  this.gameManager = gameManager;
  this.depth = 3;
}

ArtificialIntelligence.prototype.getNextMove(grid) {
  // Setting up the various move possibilities.
  var PLAYER = 0;
  var RAND = 1;

  // Recursive function that returns optimal action and its utility.
  function recurse(grid, depth, agentIndex) {
    if (depth <= 0) {
      return this.getUtility(grid);
    }
    if (agentIndex == PLAYER) {
      var best = (0, UP);
      for (var action in [0, 1, 2, 3]) {
        var next_grid, moved = this.successor(grid, action);
        if (!moved) {
          continue;
        }
        var value = recurse(next_grid, depth-1, RAND);
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
        var value = recurse(next_grid, depth-1, PLAYER);
        best = best + value * probability;
      }
      return (best, null);
    }
  }
  value, action = recurse(grid, 2*this.depth, PLAYER);
  return action;
}

/*
 * Returns the state of the grid after applying the action.
 * Also returns a boolean which represents whether the board
 * changed after applying the action.
 */
ArtificialIntelligence.prototype.successor(grid, action) {
  return this.gameManager.updateGrid(grid, action);
}

ArtificialIntelligence.prototype.getNextGridOptions = function(grid) {
  var grid_options = [];
  var num_availeble_cells = grid.numCellsAvailable();
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      next_grid = new Grid(grid.size, grid.cells);
      next_grid.insertTile(new Tile({x: x, y: y}, 2));
      grid_options.push((next_grid, 0.9/num_available_cells));
      next_grid = new Grid(grid.size, grid.cells);
      next_grid.insertTile(new Tile({x: x, y: y}, 4));
      grid_options.push((next_grid, 0.1/num_available_cells));
    }
  }
  return grid_options;
}

/*
 * Heuristic used to calculate the utility of a given grid state.
 */
ArtificialIntelligence.prototype.getUtility(grid) {
  var total = 0;
  grid.eachCell(function(x, y, tile) {
    total = total + tile.value;
  });
  var empty_tiles = grid.numCellsAvailable();
  return total * empty_tiles;
}

/*
 * Starts the AI. Calculates the best possible move given the
 * current game state and calls GameManager.move().
 */
ArtificialIntelligence.prototype.start = function() {
  while(!this.gameManager.over) {
    var grid = this.gameManager.grid;
    var move = this.getNextMove(grid);
    this.gameManager.move(move);
    break;
  }
}
