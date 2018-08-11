import React from 'react';
import { each, find, map } from 'lodash';

function hasShip({
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

function validateBoards({
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

export default class extends React.Component {
  static async getInitialProps() {
    return {};
  }

  constructor(props) {
    super(props);

    this.state = {
      ships: [
        {
          id: 'battleship',
          length: 5,
        },
        {
          id: 'destroyer',
          length: 4,
        },
      ],
      boardWidth: 15,
      boardHeight: 15,
      boards: {
        playerOne: {
          battleship: {
            x: 1,
            y: 3,
            direction: 'horizontal',
          },
          destroyer: {
            x: 6,
            y: 6,
            direction: 'vertical',
          },
        },
        playerTwo: {
          battleship: {
            x: 2,
            y: 3,
            direction: 'horizontal',
          },
          destroyer: {
            x: 6,
            y: 5,
            direction: 'vertical',
          },
        },
      },
      moves: [],
    };
  }

  render() {
    const {
      ships, boardWidth, boardHeight, boards, moves,
    } = this.state;

    validateBoards({
      ships,
      boards,
      boardWidth,
      boardHeight,
    });

    return (
      <div>
        {map(boards, (board, playerId) => (
          <div key={`${playerId}`}>
            {playerId}
            {map([...new Array(boardHeight)], (b, rowIdx) => (
              <div key={`${playerId}-row${rowIdx}`}>
                {map([...new Array(boardWidth)], (c, colIdx) => (
                  <span
                    key={`${playerId}-row${rowIdx}-col${colIdx}`}
                    hasShip={hasShip({
                      ships,
                      board,
                      rowIdx,
                      colIdx,
                    })}
                    style={{
                      background: hasShip({
                        ships,
                        board,
                        rowIdx,
                        colIdx,
                      })
                        ? 'red'
                        : 'blue',
                    }}
                  >
                    <input type="checkbox" />
                  </span>
                ))}
              </div>
            ))}
            <br />
          </div>
        ))}
      </div>
    );
  }
}
