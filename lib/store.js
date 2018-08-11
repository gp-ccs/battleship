/* eslint-disable no-underscore-dangle */

import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

import { validateBoards } from './utils';

export class Actions {
  static setFoo(fooData) {
    if (typeof fooData !== 'string' && fooData !== null) {
      throw new Error('Actions: Bad `fooData`');
    }

    return { type: 'SET_FOO', fooData };
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
  moves: [
    {
      action: 'placeShip',
      playerId: 'playerOne',
      shipId: 'battleship',
      x: 1,
      y: 3,
      direction: 'horizontal',
    },
    {
      action: 'placeShip',
      playerId: 'playerOne',
      shipId: 'destroyer',
      x: 6,
      y: 6,
      direction: 'vertical',
    },
  ],
  activePlayerId: 'playerOne',
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case 'SET_FOO':
      return {
        ...state,
        fooData: action.fooData,
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
