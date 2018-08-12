/* eslint-disable no-underscore-dangle */

import withRedux from 'next-redux-wrapper';
import { find } from 'lodash';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { isBoardValid } from './utils';

export class Actions {
  static placeShip({
    playerId, shipId, x, y, direction,
  }) {
    // if (typeof fooData !== 'string' && fooData !== null) {
    //   throw new Error('Actions: Bad `fooData`');
    // }

    return {
      type: 'PLACE_SHIP',
      playerId,
      shipId,
      x,
      y,
      direction,
    };
  }
}

export const defaultState = {
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
    playerOne: [],
    playerTwo: [],
  },
  moves: [],
  activePlayerId: 'playerOne',
};

export const reducer = (state = defaultState, action) => {
  let activePlayerId;
  let updatedBoard;

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
    default:
      return state;
  }
};

const composeEnhancers =
  (typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__) || compose;

export const makeStore = initialState =>
  createStore(reducer, initialState, composeEnhancers(applyMiddleware(thunk)));

export const wrapPageInRedux = (
  component,
  mapStateToProps = () => {},
  mapDispatchToProps = () => {}
) =>
  withRedux(
    makeStore,
    (state, ownProps) => ({
      ...mapStateToProps(state, ownProps),
      __INITIAL_STATE__: state,
    }),
    (dispatch, ownProps) => ({
      ...mapDispatchToProps(dispatch, ownProps),
      __GLOBAL_DISPATCH__: dispatch,
    })
  )(component);
