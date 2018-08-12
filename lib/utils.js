import { each, find } from 'lodash';

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
        match = true;
      }
    }
  });

  return match;
}
