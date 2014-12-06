function Grid(size, previousState) {
  this.size = size;
  this.cells = previousState ? this.fromState(previousState) : this.empty();
}

// Build a grid of the specified size
Grid.prototype.empty = function () {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(null);
    }
  }

  return cells;
};

Grid.prototype.fromState = function (state) {
  var cells = [];

  for (var x = 0; x < this.size; x++) {
    var row = cells[x] = [];

    for (var y = 0; y < this.size; y++) {
      var tile = state[x][y];
      if (!tile) {
        row.push(null);
      } else {
        if ('position' in tile) {
          row.push(new Tile(tile.position, tile.value));
        } else {
          row.push(new Tile({x: tile.x, y: tile.y}, tile.value));
        }
      }
    }
  }

  return cells;
};

// Find the first available random position
Grid.prototype.randomAvailableCell = function () {
  var cells = this.availableCells();

  if (cells.length) {
    return cells[Math.floor(Math.random() * cells.length)];
  }
};

Grid.prototype.availableCells = function () {
  var cells = [];

  this.eachCell(function (x, y, tile) {
    if (!tile) {
      cells.push({ x: x, y: y });
    }
  });

  return cells;
};

// Call callback for every cell
Grid.prototype.eachCell = function (callback) {
  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      callback(x, y, this.cells[x][y]);
    }
  }
};

// Check if there are any cells available
Grid.prototype.cellsAvailable = function () {
  return !!this.availableCells().length;
};

// Return number of cells available
Grid.prototype.numCellsAvailable = function() {
  return this.availableCells().length;
};

// Check if the specified cell is taken
Grid.prototype.cellAvailable = function (cell) {
  return !this.cellOccupied(cell);
};

Grid.prototype.cellOccupied = function (cell) {
  return !!this.cellContent(cell);
};

Grid.prototype.cellContent = function (cell) {
  if (this.withinBounds(cell)) {
    return this.cells[cell.x][cell.y];
  } else {
    return null;
  }
};

// Inserts a tile at its position
Grid.prototype.insertTile = function (tile) {
  this.cells[tile.x][tile.y] = tile;
};

Grid.prototype.removeTile = function (tile) {
  this.cells[tile.x][tile.y] = null;
};

Grid.prototype.withinBounds = function (position) {
  return position.x >= 0 && position.x < this.size &&
         position.y >= 0 && position.y < this.size;
};

Grid.prototype.serialize = function () {
  var cellState = [];

  for (var x = 0; x < this.size; x++) {
    var row = cellState[x] = [];

    for (var y = 0; y < this.size; y++) {
      row.push(this.cells[x][y] ? this.cells[x][y].serialize() : null);
    }
  }

  return {
    size: this.size,
    cells: cellState
  };
};

Grid.prototype.monotonicity = function() {
 var monoScores = [0, 0, 0, 0];

  for (var i=0; i<4; i++) {
    var current = 0;
    var next = current+1;
    while ( next<4 ) {
      while ( next<4 && !this.cellOccupied({x: i, y: next})) {
        next++;
      }
      if (next>=4) { next--; }
      var currentValue = this.cellOccupied({x:i, y:current}) ?
        Math.log(this.cellContent( this.cells[i][current] ).value) / Math.log(2) :
        0;
      var nextValue = this.cellOccupied({x:i, y:next}) ?
        Math.log(this.cellContent( this.cells[i][next] ).value) / Math.log(2) :
        0;
      if (currentValue > nextValue) {
        monoScores[0] += nextValue - currentValue;
      } else if (nextValue > currentValue) {
        monoScores[1] += currentValue - nextValue;
      }
      current = next;
      next++;
    }
  }

  for (var j=0; j<4; j++) {
    var current = 0;
    var next = current+1;
    while ( next<4 ) {
      while ( next<4 && !this.cellOccupied({x:next, y:j})) {
        next++;
      }
      if (next>=4) { next--; }
      var currentValue = this.cellOccupied({x:current, y:j}) ?
        Math.log(this.cellContent( this.cells[current][j] ).value) / Math.log(2) :
        0;
      var nextValue = this.cellOccupied({x:next, y:j}) ?
        Math.log(this.cellContent( this.cells[next][j] ).value) / Math.log(2) :
        0;
      if (currentValue > nextValue) {
        monoScores[2] += nextValue - currentValue;
      } else if (nextValue > currentValue) {
        monoScores[3] += currentValue - nextValue;
      }
      current = next;
      next++;
    }
  }

  return Math.max(monoScores[0], monoScores[1]) + Math.max(monoScores[2], monoScores[3]); 
}
