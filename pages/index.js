import React from 'react';
import { filter, find, map } from 'lodash';

import { wrapPageInRedux, Actions } from '../lib/store';
import { getShipAtPosition } from '../lib/utils';

import {
  GameHeader,
  PlayerName,
  GameMessage,
  Game,
  GameSide,
  GameRow,
  GameCell,
  GameCellCustomUI,
  GameCellCheckbox,
} from '../styles';

const Board = ({
  height,
  width,
  playerId,
  moves,
  boardDefinition,
  shipDefinitons,
  disabled,
  showShips,
  onClickGrid,
}) => (
  <div>
    {map([...new Array(height)], (b, rowIdx) => (
      <GameRow key={`${playerId}-row${rowIdx}`}>
        {map([...new Array(width)], (c, colIdx) => (
          <GameCell key={`${playerId}-row${rowIdx}-col${colIdx}`}>
            <GameCellCheckbox
              type="checkbox"
              id={`${playerId}-row${rowIdx}-col${colIdx}`}
              disabled={disabled}
              checked={!!find(moves, { x: colIdx, y: rowIdx })}
              onClick={(e) => {
                e.preventDefault();
                onClickGrid({
                  x: colIdx,
                  y: rowIdx,
                });
              }}
            />
            <GameCellCustomUI
              showShips={showShips}
              hasShip={
                !!getShipAtPosition({
                  ships: shipDefinitons,
                  board: boardDefinition,
                  x: colIdx,
                  y: rowIdx,
                })
              }
              cellWasAttacked={!!find(moves, { x: colIdx, y: rowIdx })}
            />
          </GameCell>
        ))}
      </GameRow>
    ))}
  </div>
);

class BattleshipPage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      placementDirection: 'horizontal',
    };
  }

  static async getInitialProps() {
    return {};
  }

  render() {
    const {
      ships,
      boardWidth,
      boardHeight,
      gameMessage,
      gameOver,
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
        <GameHeader>
          Current player: <PlayerName>{activePlayerId}</PlayerName>
          <GameMessage>{gameMessage}</GameMessage>
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
        </GameHeader>
        <Game>
          <GameSide>
            <div>THE ENEMY</div>
            <Board
              height={boardHeight}
              width={boardWidth}
              playerId={adversaryId}
              moves={filter(moves, { playerId: activePlayerId })}
              boardDefinition={adversaryBoard}
              shipDefinitons={ships}
              showShips={false}
              disabled={gameOver}
              onClickGrid={({ x, y }) => {
                if (shipToBePlaced) {
                  return false;
                }

                return attack({
                  playerId: activePlayerId,
                  x,
                  y,
                });
              }}
            />
          </GameSide>
          <GameSide>
            <div>YOUR FLEET</div>
            <Board
              height={boardHeight}
              width={boardWidth}
              playerId={activePlayerId}
              moves={filter(moves, { playerId: adversaryId })}
              boardDefinition={activePlayerBoard}
              shipDefinitons={ships}
              showShips
              disabled={gameOver}
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
          </GameSide>
        </Game>
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
  gameOver,
}) => ({
  ships,
  boardWidth,
  boardHeight,
  boards,
  moves,
  activePlayerId,
  gameMessage,
  gameOver,
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
