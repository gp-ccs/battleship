import withRedux from 'next-redux-wrapper';
import { find } from 'lodash';
import { createStore } from 'redux';

import { isBoardValid, evaluateAttack } from './utils';

export class Actions {
  static placeShip({
    playerId, shipId, x, y, direction,
  }) {
    return {
      type: 'PLACE_SHIP',
      playerId,
      shipId,
      x,
      y,
      direction,
    };
  }

  static attack({ playerId, x, y }) {
    return {
      type: 'ATTACK',
      playerId,
      x,
      y,
    };
  }
}

// TODO: Ships and board dimensions -> Configuration file
export const defaultState = {
  ships: [
    {
      id: 'Aircraft Carrier',
      length: 5,
    },
    {
      id: 'Battleship',
      length: 4,
    },
    {
      id: 'Destroyer',
      length: 3,
    },
    {
      id: 'Submarine',
      length: 3,
    },
    {
      id: 'Minesweeper',
      length: 2,
    },
  ],
  boardWidth: 15,
  boardHeight: 15,
  boards: {
    playerOne: [],
    playerTwo: [],
  },
  gameMessage: '',
  moves: [],
  activePlayerId: 'playerOne',
  gameOver: false,
};

export const reducer = (state = defaultState, action) => {
  let activePlayerId;
  let updatedBoard;
  let result;
  let adversaryId;

  switch (action.type) {
    case 'PLACE_SHIP':
      updatedBoard = [
        ...state.boards[action.playerId],
        {
          shipId: action.shipId,
          x: action.x,
          y: action.y,
          direction: action.direction,
        },
      ];

      // Validate that ship can be placed here.
      if (
        !isBoardValid({
          ships: state.ships,
          board: updatedBoard,
          boardWidth: state.boardWidth,
          boardHeight: state.boardHeight,
        })
      ) {
        return state;
      }

      // Validate that ship is available to be placed
      if (find(state.boards[action.playerId], { shipId: action.shipId })) {
        return state;
      }

      activePlayerId = action.playerId;

      // If this is the last ship to place, switch to player two.
      if (
        activePlayerId === 'playerOne' &&
        state.boards[action.playerId].length === state.ships.length - 1
      ) {
        activePlayerId = 'playerTwo';
      } else if (
        activePlayerId === 'playerTwo' &&
        state.boards[action.playerId].length === state.ships.length - 1
      ) {
        activePlayerId = 'playerOne';
      }

      return {
        ...state,
        activePlayerId,
        boards: {
          ...state.boards,
          [action.playerId]: updatedBoard,
        },
      };
    case 'ATTACK':
      if (action.playerId === 'playerOne') {
        activePlayerId = 'playerTwo';
      } else if (action.playerId === 'playerTwo') {
        activePlayerId = 'playerOne';
      }

      adversaryId = find(Object.keys(state.boards), o => o !== action.playerId);

      result = evaluateAttack({
        board: state.boards[adversaryId],
        ships: state.ships,
        moves: state.moves,
        attackingPlayerId: action.playerId,
        x: action.x,
        y: action.y,
      });

      return {
        ...state,
        activePlayerId,
        gameMessage: result,
        gameOver: result === 'win',
        moves: [...state.moves, { playerId: action.playerId, x: action.x, y: action.y }],
      };
    default:
      return state;
  }
};

export const makeStore = initialState => createStore(reducer, initialState);

export const wrapPageInRedux = (
  component,
  mapStateToProps = () => {},
  mapDispatchToProps = () => {}
) =>
  withRedux(
    makeStore,
    (state, ownProps) => mapStateToProps(state, ownProps),
    (dispatch, ownProps) => mapDispatchToProps(dispatch, ownProps)
  )(component);
