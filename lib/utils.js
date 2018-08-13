import { each, every, filter, find } from 'lodash';

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

export function getShipAtPosition({
  ships, board, x, y,
}) {
  let match = false;

  each(board, (shipData) => {
    const shipDefinition = find(ships, { id: shipData.shipId });

    for (let i = 0; i < shipDefinition.length; i += 1) {
      if (
        shipData.x + (shipData.direction === 'horizontal' ? i : 0) === x &&
        shipData.y + (shipData.direction === 'vertical' ? i : 0) === y
      ) {
        match = shipData;
      }
    }
  });

  return match;
}

export function isShipSunk({
  ships, shipId, board, moves,
}) {
  const shipDefinition = find(ships, { id: shipId });
  const shipData = find(board, { shipId });
  let isSunk = true;

  for (let i = 0; i < shipDefinition.length; i += 1) {
    if (
      !find(moves, {
        x: shipData.x + (shipData.direction === 'horizontal' ? i : 0),
        y: shipData.y + (shipData.direction === 'vertical' ? i : 0),
      })
    ) {
      isSunk = false;
    }
  }

  return isSunk;
}

export function areAllShipsSunk({ board, moves, ships }) {
  return every(board, shipData =>
    isShipSunk({
      ships,
      shipId: shipData.shipId,
      board,
      moves,
    }));
}

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
  const hitShip = getShipAtPosition({
    ships,
    board,
    x,
    y,
  });

  if (find(playerMoves, { x, y })) {
    return 'already_taken';
  } else if (hitShip) {
    const playerMovesIncludingThisOne = [...playerMoves, { x, y }];

    if (
      isShipSunk({
        ships,
        shipId: hitShip.shipId,
        board,
        moves: playerMovesIncludingThisOne,
      })
    ) {
      if (areAllShipsSunk({ board, moves: playerMovesIncludingThisOne, ships })) {
        return 'win';
      }
      return 'sunk';
    }
    return 'hit';
  }
  return 'miss';
}
