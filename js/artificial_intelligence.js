function ArtificialIntelligence(gameManager, type) {
  this.gameManager = gameManager;
  this.depth = 3;
  this.timeout = 650;
  this.type = type;
  this.timeKeeper = Array.apply(null, new Array(16)).map(Number.prototype.valueOf,0);
  this.countKeeper = Array.apply(null, new Array(16)).map(Number.prototype.valueOf,0);
}

ArtificialIntelligence.prototype.random = function() {
 return [null, Math.floor(Math.random() * 4)];
}

ArtificialIntelligence.prototype.minimax = function(grid, depth, agentIndex, minimum, maximum) {
  var PLAYER = 0;
  var RAND = 1;

  if (depth <= 0) {
    return [this.getUtility(grid), 0];
  }
  if (agentIndex == 0) {
    var best = [0, 0];
    for (var action in [0, 1, 2, 3]) {
      var next_grid_array = this.gameManager.updateGrid(grid, action);
      var next_grid = next_grid_array[0];
      var moved = next_grid_array[1];
      if (!moved) {
        continue;
      }
      var value_array = this.minimax(next_grid, depth-1, RAND, minimum, maximum);
      var maximum = value_array[0];
      if (maximum < minimum) {
        return best;
      }
      if (maximum >= best[0]) {
        best = [maximum, action];
      }
    }
    return best;
  } else {
    var grid_options = this.getNextGridOptions(grid);
    var best = 0
    for (var grid_option_index in grid_options) {
      var grid_option = grid_options[grid_option_index];
      var next_grid = grid_option[0];
      var probability = grid_option[1];
      var value_array = this.minimax(next_grid, depth-1, PLAYER, minimum, maximum);
      var minimum = value_array[0];
      if (maximum < minimum) {
        return [best, 0];
      }
      best = best + minimum * probability;
    }
    return [best, 0];

  }
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
  // Vary depth for animation purposes.
  var depth = 2*this.depth - 1;
  // Calculate time per call for testing purposes.
  var num_cells_available = grid.numCellsAvailable();
  if (this.type == 'expectimax' && num_cells_available > 8) {
    depth = depth - 2;
  }
  //var start = (new Date()).getTime();

  var value_array;
  if (this.type == 'expectimax') value_array = this.expectimax(grid, depth, 0);
  else if (this.type == 'minimax') value_array = this.minimax(grid, depth, 0, Number.MIN_VALUE, Number.MAX_VALUE);
  else if (this.type == 'random') value_array = this.random();
  else value_array = this.expectimax(grid, depth, 0);

  //var time = (new Date()).getTime() - start;
  //this.timeKeeper[num_cells_available] = (this.timeKeeper[num_cells_available] * this.countKeeper[num_cells_available] + time)/(this.countKeeper[num_cells_available] + 1);
  //this.countKeeper[num_cells_available]++;
  //console.log(this.timeKeeper);
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
  var max = 0;
  grid.eachCell(function(x, y, tile) {
    if (tile) {
      total = total + tile.value;
      if (tile.value > max) {
        max = tile.value;
      }
    }
  });
  var empty_tiles = grid.numCellsAvailable();
  var monotonicity = 1;//grid.monotonicity()
  return max * empty_tiles * monotonicity;
}

ArtificialIntelligence.prototype.run = function() {
  var grid = this.gameManager.grid;
  var move = this.getNextMove(grid);
  this.gameManager.move(move);
}

/*
 * Starts the AI. Calculates the best possible move given the
 * current game state and calls GameManager.move().
 */
ArtificialIntelligence.prototype.start = function() {
  var self = this;
    setInterval(function(){
      self.run();
    }, self.timeout);
}
