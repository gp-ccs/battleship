import React from 'react';
import { filter, find, map } from 'lodash';

import { wrapPageInRedux, Actions } from '../lib/store';
import { hasShip } from '../lib/utils';

const Board = ({
  height,
  width,
  playerId,
  moves,
  boardDefinition,
  shipDefinitons,
  showShips,
  onClickGrid,
}) => (
  <div>
    {map([...new Array(height)], (b, rowIdx) => (
      <div key={`${playerId}-row${rowIdx}`}>
        {map([...new Array(width)], (c, colIdx) => (
          <span
            key={`${playerId}-row${rowIdx}-col${colIdx}`}
            style={{
              background:
                showShips &&
                hasShip({
                  ships: shipDefinitons,
                  board: boardDefinition,
                  rowIdx,
                  colIdx,
                })
                  ? 'lightgray'
                  : 'blue',
            }}
          >
            <input
              type="checkbox"
              checked={!!find(moves, { x: colIdx, y: rowIdx })}
              onClick={(e) => {
                e.preventDefault();
                onClickGrid({
                  x: colIdx,
                  y: rowIdx,
                });
              }}
            />
          </span>
        ))}
      </div>
    ))}
  </div>
);

class BattleshipPage extends React.Component {
  static async getInitialProps() {
    return {};
  }

  constructor(props) {
    super(props);

    this.state = {
      placementDirection: 'horizontal',
    };
  }

  render() {
    const {
      ships,
      boardWidth,
      boardHeight,
      gameMessage,
      boards,
      moves,
      activePlayerId,
      attack,
      placeShip,
    } = this.props;

    const { placementDirection } = this.state;
    const activePlayerBoard = boards[activePlayerId];

    const adversaryId = find(Object.keys(boards), o => o !== activePlayerId);
    const adversaryBoard = boards[adversaryId];

    const shipToBePlaced = find(ships, o => !find(activePlayerBoard, { shipId: o.id }));

    return (
      <div>
        {activePlayerId}
        <div>{gameMessage}</div>
        {shipToBePlaced && (
          <div>
            Place your {shipToBePlaced.id}
            <input
              type="radio"
              value="horizontal"
              checked={placementDirection === 'horizontal'}
              onChange={(e) => {
                this.setState({
                  placementDirection: e.target.value,
                });
              }}
            />{' '}
            Horizontal
            <input
              type="radio"
              value="vertical"
              checked={placementDirection === 'vertical'}
              onChange={(e) => {
                this.setState({
                  placementDirection: e.target.value,
                });
              }}
            />Vertical
          </div>
        )}
        <div>ENEMY</div>
        <Board
          height={boardHeight}
          width={boardWidth}
          playerId={adversaryId}
          moves={filter(moves, { playerId: activePlayerId })}
          boardDefinition={adversaryBoard}
          shipDefinitons={ships}
          showShips={false}
          onClickGrid={({ x, y }) => {
            if (shipToBePlaced) {
              return false;
            }

            attack({
              playerId: activePlayerId,
              x,
              y,
            });
          }}
        />
        <div>YOUR FLEET</div>
        <Board
          height={boardHeight}
          width={boardWidth}
          playerId={activePlayerId}
          moves={filter(moves, { playerId: adversaryId })}
          boardDefinition={activePlayerBoard}
          shipDefinitons={ships}
          showShips
          onClickGrid={({ x, y }) => {
            if (activePlayerBoard.length < ships.length) {
              placeShip({
                playerId: activePlayerId,
                shipId: shipToBePlaced.id,
                x,
                y,
                direction: placementDirection,
              });
            }
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({
  ships,
  boardWidth,
  boardHeight,
  boards,
  moves,
  activePlayerId,
  gameMessage,
}) => ({
  ships,
  boardWidth,
  boardHeight,
  boards,
  moves,
  activePlayerId,
  gameMessage,
});

const mapDispatchToProps = dispatch => ({
  placeShip: (options) => {
    dispatch(Actions.placeShip(options));
  },
  attack: (options) => {
    dispatch(Actions.attack(options));
  },
});

export default wrapPageInRedux(BattleshipPage, mapStateToProps, mapDispatchToProps);
