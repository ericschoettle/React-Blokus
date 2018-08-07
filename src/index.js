import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

let boardSize = 20;

function Square(props) {
    return (
        <button
            className={`square ${props.squareInfo.playerNumber !== null ? 'player' + props.squareInfo.playerNumber: ''} ${props.squareInfo.active ? 'active' : ''}`}
            onClick={props.onClick}
        >
        </button>
    );
}

class Row extends React.Component {
    render () {
        const squares = [];
        for (let j = 0; j < this.props.squares.length; j++) {
            squares.push(<Square 
                key ={j} 
                onClick={() => this.props.onClick(j, this.props.rowIndex)}
                squareInfo = {this.props.squares[j]} // Naming here is temporary - passing the value in player number, rather than the whole object, to make testing easier
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
                    return {playerNumber: square.playerNumber, active: square.active};
                })}
                onClick = {this.props.onClick}/>)
        } 
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
            rows: Array(boardSize).fill({squares:Array(boardSize).fill({playerNumber: null, active: null, pieceIndex: null })}),
            pieces: makePieces({
                playerNumber: 0, 
                boardNumber: 0,
            }),
            activePieceIndex: null,
            xIsNext: true,
        }
    }

    // takes a piece and draws it on the board, in terms of rows/columns
    drawPieces(pieces, rows, erase = false) {
        pieces.forEach((piece, pieceIndex) => {
            piece.cells.forEach(cell => {
                const xCoord = piece.centerX + cell[0];
                const yCoord = piece.centerY + cell[1];
                rows = update(rows, {
                    rows: {[yCoord]:{squares:{[xCoord]:{$set: {
                        playerNumber: erase? null : piece.playerNumber, 
                        active: erase? null : piece.active, 
                        pieceIndex: erase? null : pieceIndex
                    }}}}}
                });
            });
        })
        debugger;
        return rows;
    }

    componentDidMount() {
        // initialize board
        const rows = this.state.rows
        const pieces = this.state.pieces;
        const newRows = this.drawPieces(pieces,rows)
        this.setState({
            rows: newRows,
        })
    }

    render() {
        const rows = this.state.rows;
        const controls = ['rotClock', 'rotCounterClock', 'flipV', 'flipH', 'moveLeft', 'moveRight', 'moveUp', 'moveDown'];
        const controlsJSX = controls.map(control => {
            if (this.state.activePieceIndex !== null) {
                return (
                    <li key= {control}>
                        <button onClick = {() => this.movePiece(control)}>
                            {control}
                        </button>
                    </li>
                );
            }
        });

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        rows={rows}
                        onClick={(x,y) => this.handleClick(x,y)}
                    />
                </div>
                <div className="game-controls">
                    <ul>{controlsJSX}</ul> 
                </div>
            </div>  
        );
    }
    movePiece(control) {
        const rows = this.state.rows;

        const piece = this.state.pieces.slice(this.state.activePieceIndex, this.state.activePieceIndex + 1);
        const erasedrows = this.drawPieces(piece, rows, true); 
        // perform transformation       
        this[control](piece[0])
        const drawnRows = this.drawPieces(piece, erasedrows);

        this.setState({
            rows: drawnRows,
        })
        // set state with new pieces, 
    }
    // function will test if location is valid.
    validLocation(piece) {
        return true
    }
    testCellOffBoard(piece) {
        return function(cell, index, array) {
            return (piece.centerX + cell[0] < 0 || piece.centerY + cell[1] < 0 || piece.centerX + cell[0] >= boardSize || piece.centerY + cell[1] >= boardSize)
        }
    }
    testPieceOffBoard(piece) {
        if (piece.cells.some(this.testCellOffBoard(piece))) {
          return true
        } else {
            // alert - piece off board
        }
      }

      moveLeft(piece) {
        piece.centerX -= 1
        if (this.testPieceOffBoard(piece)) {
          this.moveRight(piece)
        }
        return piece
      }
    
      moveRight(piece) {
        piece.centerX += 1
        if (this.testPieceOffBoard(piece)) {
          this.moveLeft(piece)
        }
        return piece
      }
    
      moveUp(piece) {
        piece.centerY -= 1
        if (this.testPieceOffBoard(piece)) {
          this.moveDown(piece)
        }
        return piece
      }
    
      moveDown(piece) {
        piece.centerY += 1
        if (this.testPieceOffBoard(piece)) {
          this.moveUp(piece)
        }
        return piece
      }
    
      flipH(piece) {
        piece.cells.forEach((cell) => {
          cell[0] = -cell[0]
        })
        if (this.testPieceOffBoard(piece)) {
          this.flipH(piece)
        }
        return piece
      }
    
      flipV(piece) {
        piece.cells.forEach((cell) => {
          cell[1] = -cell[1]
        })
        if (this.testPieceOffBoard(piece)) {
          this.flipV(piece)
        }
        return piece
      }
    
      rotCounterClock(piece) {
        piece.cells.forEach((cell) => {
          var tempX = cell[0]
          cell[0] = cell[1]
          cell[1] = -tempX
        })
        if (this.testPieceOffBoard(piece)) {
          this.rotClock(piece)
        }
        return piece
      }
      
      rotClock(piece) {
        piece.cells.forEach((cell) => {
          var tempX = cell[0]
          cell[0] = -cell[1]
          cell[1] = tempX
        })
        if (this.testPieceOffBoard(piece)) {
          this.rotCounterClock(piece)
        }
        return piece
      }


    handleClick(centerX, centerY) {
        const rows = this.state.rows;
        // const squares = rows.slice();
        const pieceIndex = rows[centerY].squares[centerX].pieceIndex;
        const oldPieces = this.state.pieces.slice();

        let newPieces = [];
        let newRows = [];
        let activePieceIndex = this.state.activePieceIndex;
        // 'pick up' piece
        if (pieceIndex !== null && activePieceIndex === null) {
            newPieces = update(oldPieces, {[pieceIndex]:{$merge:{
                active: true
            }}})
            activePieceIndex = pieceIndex;
        
            newRows = this.drawPieces([newPieces[pieceIndex]], rows)
        // put piece down
        } else if (activePieceIndex !== null && this.validLocation(newPieces[pieceIndex])) {
            activePieceIndex = null;
        }
        

        this.setState({
            pieces: newPieces,
            activePieceIndex: activePieceIndex,
            rows: newRows
        })
    }
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


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