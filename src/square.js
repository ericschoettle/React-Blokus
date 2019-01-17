import React from 'react';

function Square(props) {
    const cornerString = typeof props.squareInfo.corner !== 'number' ? '' : ' corner' + props.squareInfo.corner;
    const inactivePieceString = typeof props.squareInfo.inactivePiecePlayerIndex !== 'number' ? '' : ' setPlayer' + props.squareInfo.inactivePiecePlayerIndex;
    const activePieceString = typeof props.squareInfo.activePiecePlayerIndex !== 'number' ? '' : ' activePlayer' + props.squareInfo.activePiecePlayerIndex;
    const validLocationString = (props.squareInfo.valid === false) ? ' invalid' : '';

    return (
        <td
            className={`${cornerString}${inactivePieceString}${activePieceString}${validLocationString}`}
            onClick={props.onClick}>
        </td>
    );
}

export default Square