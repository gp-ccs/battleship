import styled from 'styled-components';

const CELL_SIZE = '25px';

function getEmojiForCell(hasShip, cellWasAttacked, showShips) {
  if (cellWasAttacked && !hasShip) {
    return '❌';
  } else if (cellWasAttacked && hasShip) {
    return '💥';
  } else if (hasShip && showShips) {
    return '';
  }

  return '🌊';
}

export const GameRow = styled.div`
  height: ${CELL_SIZE};
`;

export const GameCell = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  position: relative;
  height: ${CELL_SIZE};
  width: ${CELL_SIZE};
`;

export const GameCellCustomUI = styled.span`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;

  &:before {
    width: 100%;
    height: 100%;
    content: ${props =>
    `'${getEmojiForCell(props.hasShip, props.cellWasAttacked, props.showShips)}'`};
    display: flex;
    align-items: center;
    justify-content: center;
    background: blue;
    background: ${props => props.hasShip && props.showShips && 'lightgrey'};
  }
`;

export const GameCellCheckbox = styled.input`
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
`;
