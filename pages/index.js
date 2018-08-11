import React from 'react';
import { map } from 'lodash';

import { wrapPageInRedux, Actions } from '../lib/store';
import { hasShip } from '../lib/utils';

class BattleshipPage extends React.Component {
  static async getInitialProps() {
    return {};
  }

  render() {
    const {
      ships, boardWidth, boardHeight, boards, moves, activePlayerId,
    } = this.props;

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
                        ? 'lightgray'
                        : 'blue',
                    }}
                  >
                    <input type="checkbox" disabled={playerId !== activePlayerId} />
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

const mapStateToProps = ({
  ships, boardWidth, boardHeight, boards, moves, activePlayerId,
}) => ({
  ships,
  boardWidth,
  boardHeight,
  boards,
  moves,
  activePlayerId,
});

const mapDispatchToProps = dispatch => ({});

export default wrapPageInRedux(BattleshipPage, mapStateToProps, mapDispatchToProps);
