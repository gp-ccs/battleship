/* eslint-disable no-underscore-dangle */

import {} from 'lodash';
import withRedux from 'next-redux-wrapper';
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';

export class Actions {
  static setFoo(fooData) {
    if (typeof fooData !== 'string' && fooData !== null) {
      throw new Error('Actions: Bad `fooData`');
    }

    return { type: 'SET_FOO', fooData };
  }
}

export const defaultState = {
  fooData: 123,
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
