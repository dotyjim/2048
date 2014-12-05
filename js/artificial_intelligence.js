function ArtificialIntelligence(gameManager) {
  this.gameManager = gameManager;
  this.depth = 2;
}

// Recursive function that returns optimal action and its utility.
ArtificialIntelligence.prototype.expectimax =  function(grid, depth, agentIndex) {
  // Setting up the various move possibilities.
  var PLAYER = 0;
  var RAND = 1;

  if (depth <= 0) {
    return [this.getUtility(grid), 0];
  }
  if (agentIndex == PLAYER) {
    var best = [0, 0];
    for (var action in [0, 1, 2, 3]) {
      var next_grid_array = this.gameManager.updateGrid(grid, action);
      var next_grid = next_grid_array[0];
      var moved = next_grid_array[1];
      if (!moved) {
        continue;
      }
      var value_array = this.expectimax(next_grid, depth-1, RAND);
      var value = value_array[0];
      if (value >= best[0]) {
        best = [value, action];
      }
    }
    return best;
  } else { // agentIndex == RAND
    var grid_options = this.getNextGridOptions(grid);
    var best = 0
    for (var grid_option_index in grid_options) {
      var grid_option = grid_options[grid_option_index];
      var next_grid = grid_option[0];
      var probability = grid_option[1];
      var value_array = this.expectimax(next_grid, depth-1, PLAYER);
      var value = value_array[0];
      best = best + value * probability;
    }
    return [best, 0];
  }
}

ArtificialIntelligence.prototype.getNextMove = function(grid) {
  var value_array = this.expectimax(grid, 2*this.depth, 0);
  var action = value_array[1];
  return action;
}

ArtificialIntelligence.prototype.getNextGridOptions = function(grid) {
  var grid_options = [];
  var num_available_cells = grid.numCellsAvailable();
  grid.eachCell(function(x, y, tile) {
    if (!tile) {
      next_grid = new Grid(grid.size, grid.cells);
      next_grid.insertTile(new Tile({'x': x, 'y': y}, 2));
      grid_options.push([next_grid, 0.9/num_available_cells]);
      next_grid = new Grid(grid.size, grid.cells);
      next_grid.insertTile(new Tile({'x': x, 'y': y}, 4));
      grid_options.push([next_grid, 0.1/num_available_cells]);
    }
  });
  return grid_options;
}

/*
 * Heuristic used to calculate the utility of a given grid state.
 */
ArtificialIntelligence.prototype.getUtility = function(grid) {
  var total = 0;
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      total = total + tile.value;
    }
  });
  var empty_tiles = grid.numCellsAvailable();
  return total * empty_tiles;
}

/*
 * Starts the AI. Calculates the best possible move given the
 * current game state and calls GameManager.move().
 */
ArtificialIntelligence.prototype.start = function() {
  num = 0
  while(!this.gameManager.over) {
    var grid = this.gameManager.grid;
    var move = this.getNextMove(grid);
    this.gameManager.move(move);
    //if (num == 2) 
      //break;
    num++;
  }
}
