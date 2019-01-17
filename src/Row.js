import React from 'react';
import Square from './Square.js'

class Row extends React.Component {
    render() {
        let squares = [];
        for (let j = 0; j < this.props.squares.length; j++) {
            squares.push(<Square
                key={j}
                onClick={() => this.props.onClick(j, this.props.rowIndex)}
                squareInfo={this.props.squares[j]} // Naming here is temporary - passing the value in player number, rather than the whole object, to make testing easier
            />)
        }
        return (
            <tr>
                {squares}
            </tr>
        )
    }
}

export default Row;