import { each, filter, find } from 'lodash';

export function isBoardValid({
  ships, board, boardWidth, boardHeight,
}) {
  let valid = true;
  const coordinatesWithShips = [];

  each(board, (shipData) => {
    const shipDefinition = find(ships, { id: shipData.shipId });

    if (shipData.direction === 'horizontal') {
      if (shipData.x < 0 || shipData.x + shipDefinition.length > boardWidth) {
        valid = false;
      }
    } else if (shipData.direction === 'vertical') {
      if (shipData.y < 0 || shipData.y + shipDefinition.length > boardHeight) {
        valid = false;
      }
    }

    for (let i = 0; i < shipDefinition.length; i += 1) {
      const newCoords = {
        x: shipData.x + (shipData.direction === 'horizontal' ? i : 0),
        y: shipData.y + (shipData.direction === 'vertical' ? i : 0),
      };

      if (find(coordinatesWithShips, newCoords)) {
        valid = false;
      }
      coordinatesWithShips.push(newCoords);
    }
  });

  return valid;
}

export function hasShip({
  ships, board, rowIdx, colIdx,
}) {
  let match = false;

  each(board, (shipData) => {
    const shipDefinition = find(ships, { id: shipData.shipId });

    for (let i = 0; i < shipDefinition.length; i += 1) {
      if (
        shipData.x + (shipData.direction === 'horizontal' ? i : 0) === colIdx &&
        shipData.y + (shipData.direction === 'vertical' ? i : 0) === rowIdx
      ) {
        match = shipData;
      }
    }
  });

  return match;
}

export function isShipSunk({ shipId, board, moves }) {}

export function areAllShipsSunk({ board, moves }) {}

// From prompt:
// ● “Already Taken” if the position has previously been attacked
// ● “Hit” if the opponent has a ship covering the position
// ● “Miss” if there is no ship covering the position
// ● “Sunk” if all the positions a ship covers have been hit
// ● “Win” if all the ships on the opponent's grid have been sunk
export function evaluateAttack({
  board, ships, moves, attackingPlayerId, x, y,
}) {
  const playerMoves = filter(moves, { playerId: attackingPlayerId });
  const hitShip = hasShip({
    ships,
    board,
    rowIdx: y,
    colIdx: x,
  });

  if (find(playerMoves, { x, y })) {
    return 'already_taken';
  } else if (hitShip) {
    const playerMovesIncludingThisOne = [...playerMoves, { x, y }];

    if (isShipSunk({ shipId: hitShip.shipId, board, moves: playerMovesIncludingThisOne })) {
      if (areAllShipsSunk({ board, moves: playerMovesIncludingThisOne })) {
        return 'win';
      }
      return 'sunk';
    }

    return 'hit';
  }

  return 'miss';
}
