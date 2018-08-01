import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

let boardSize = 20;

function Square(props) {
    return (
        <button
            className={`square player${props.playernumber || ''}`}
            onClick={props.onClick}
        >
        </button>
    );
}

class Row extends React.Component {
    render () {
        // debugger; // And here this.props.squares isn't updating with what was passed in from Board
        const squares = [];
        for (let j = 0; j < this.props.squares.length; j++) {
            squares.push(<Square 
                key ={j} 
                onClick={() => this.props.onClick(j, this.props.rowIndex)}
                playernumber = {this.props.squares[j]} // Naming here is temporary - passing the value in player number, rather than the whole object, to make testing easier
            />)
        }
        return (
            <div className="board-row">
                {squares}
            </div>
        )
    }
}


class Board extends React.Component {
    render() {
        let rows = [];
        for (let i = 0; i < this.props.rows.length; i++) {
            rows.push(<Row 
                key ={i} 
                rowIndex = {i} 
                squares = {this.props.rows[i].squares.map(square => {
                    return {playerNumber: square.playerNumber};
                })}
                onClick = {this.props.onClick}/>)
        } 
        // debugger // here rows has the updated value for squares
        return (
            <div>
                {rows}
            </div>
        );
    }
}

// class Player extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             // name: props.name,
//             number: props.number,
//             // color: props.color,
//         }
//     }

//     placePiece
// }

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                rows: Array(boardSize).fill({squares: Array(boardSize).fill({playerNumber: null, pieceIndex: null })}),
                // players: play
            }],
            pieces: makePieces({
                playerNumber: 0, 
                boardNumber: 0,
            }),
            stepNumber: 0,
            xIsNext: true,
        }
    }

    // takes a piece and draws it on the board, in terms of rows/columns
    drawPieces(pieces) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        let current = history[this.state.stepNumber];
        pieces.forEach(piece => {
            piece.cells.forEach(cell => {
                const xCoord = piece.centerX + cell[0];
                const yCoord = piece.centerY + cell[1];
                current = update(current, {
                    rows: {[yCoord]:{squares:{[xCoord]:{$set: {playerNumber: piece.playerNumber, pieceIndex: piece.pieceIndex}}}}}
                });
            });
        })
        
        this.setState({
            history: history.concat([current]),
            stepNumber: history.length,
        })
    }
    componentDidMount() {
        // initialize board
        const pieces = this.state.pieces;
        this.drawPieces(pieces)
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.rows);

        const moves = history.map((step, move) => {
            const description = move ? `Go to move #${move}` : 'Go to game start';
            return (
                <li key= {move}>
                    <button onClick = {() => this.jumpTo(move)}>
                        {description}
                    </button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = `Winner: ${winner}`
        } else {
            status = `Next player: ${(this.state.xIsNext ? 'X' : 'O')}`;
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={current.rows}
                        onClick={(x,y) => this.handleClick(x,y)}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
    handleClick(centerX, centerY) {
        // const history = this.state.history.slice(0,this.state.stepNumber + 1);
        // const current = history[this.state.stepNumber];
        // const squares = current.rows.slice();
    
        let piece = this.state.pieces.splice(0,1);
        piece[0].centerX = centerX;
        piece[0].centerY = centerY;

        this.drawPieces([piece[0]]);



        // if (calculateWinner(squares) || squares[i]) {
        //     return;
        // }
        // squares[i] = this.state.xIsNext ? 'X' : 'O';

        // this.setState({
        //     history: history.concat([{
        //         squares: squares,
        //     }]),
        //     stepNumber: history.length,
        //     xIsNext: !this.state.xIsNext,
        // })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

function calculateWinner(squares) {
    // const lines = [
    //     [0, 1, 2],
    //     [3, 4, 5],
    //     [6, 7, 8],
    //     [0, 3, 6],
    //     [1, 4, 7],
    //     [2, 5, 8],
    //     [0, 4, 8],
    //     [2, 4, 6],
    // ];
    // for (let i = 0; i < lines.length; i++) {
    //     const [a, b, c] = lines[i];
    //     if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
    //         return squares[a];
    //     }
    // }
    return null;
}

function makePieces(props) {
    return [
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 1,
          centerY: 1,
          active: false,
          cells: [[0,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 3,
          centerY: 1,
          active: false,
          cells: [[0,0], [0,1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 5,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [0,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 7,
          centerY: 1,
          active: false,
          cells: [[0,0], [0,1], [1,0]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 10,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [1,0], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 13,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 1,
          centerY: 4,
          active: false,
          cells: [[0,0], [0,1], [0,2], [1,0]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 4,
          centerY: 5,
          active: false,
          cells: [[0,0], [0,1], [1,1], [1,0]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 7,
          centerY: 5,
          active: false,
          cells: [[0,0], [0,1], [1,0], [1,-1], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 10,
          centerY: 6,
          active: false,
          cells: [[1,1], [0,1], [1,0], [1,-1], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 1,
          centerY: 9,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1], [1,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 12,
          centerY: 14,
          active: false,
          cells: [[0,0], [1,0], [0,1], [0,-1], [-1,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 13,
          centerY: 8,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1], [0,-2]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 4,
          centerY: 9,
          active: false,
          cells: [[0,0], [0,1], [-1,1], [0,-1], [1,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 2,
          centerY: 14,
          active: false,
          cells: [[-1,-1], [-1,0], [-1,1], [0,-1], [1,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 7,
          centerY: 9,
          active: false,
          cells: [[0,0], [-1,0], [-1,1], [0,-1], [1,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 9,
          centerY: 11,
          active: false,
          cells: [[0,0], [-1,0], [-1,1], [0,-1], [0,-2]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 11,
          centerY: 11,
          active: false,
          cells: [[0,0], [1,0], [0,1], [0,-1], [0,-2]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 6,
          centerY: 14,
          active: false,
          cells: [[0,0], [1,0], [-1,1], [0,-1], [-1,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          centerX: 9,
          centerY: 14,
          active: false,
          cells: [[0,0], [0,1], [-1,1], [0,-1], [1,1]],
        },
    ]
}