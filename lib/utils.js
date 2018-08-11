import { each, find } from 'lodash';

export function validateBoards({
  ships, boards, boardWidth, boardHeight,
}) {
  each(boards, (board) => {
    each(board, (shipData, shipName) => {
      const shipDefinition = find(ships, { id: shipName });

      if (shipData.direction === 'horizontal') {
        if (shipData.x < 0 || shipData.x + shipDefinition.length > boardWidth) {
          throw new Error('Invalid board! Some ships off board.');
        }
      } else if (shipData.direction === 'vertical') {
        if (shipData.y < 0 || shipData.y + shipDefinition.length > boardHeight) {
          throw new Error('Invalid board! Some ships off board.');
        }
      }
    });
  });
}

export function hasShip({
  ships, board, rowIdx, colIdx,
}) {
  let match = false;

  each(board, (shipData, shipName) => {
    const shipDefinition = find(ships, { id: shipName });

    for (let i = 0; i < shipDefinition.length; i += 1) {
      if (
        shipData.x + (shipData.direction === 'horizontal' ? i : 0) === colIdx &&
        shipData.y + (shipData.direction === 'vertical' ? i : 0) === rowIdx
      ) {
        if (match === true) {
          throw new Error('Invalid board! Two ships overlapping.');
        }

        match = true;
      }
    }
  });

  return match;
}
