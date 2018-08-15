import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

let boardSize = 20;

function Square(props) {
    const inactivePieceString = props.squareInfo.inactivePiecePlayerNumber === null ? '' : 'setPlayer' + props.squareInfo.inactivePiecePlayerNumber;
    const activePieceString = props.squareInfo.activePiecePlayerNumber === null ? '' : 'activePlayer' + props.squareInfo.activePiecePlayerNumber;    
    const validLocationString = props.squareInfo.valid === true ? 'valid' : 'invalid'
    return (
        <button
            className={`square ${inactivePieceString} ${activePieceString} ${validLocationString}`}
            onClick={props.onClick}
        >
        </button>
    );
}

class Row extends React.Component {
    render () {
        const squares = [];
        debugger;
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
                    return {
                        inactivePiecePlayerNumber: square.inactivePiecePlayerNumber,
                        activePiecePlayerNumber: square.activePiecePlayerNumber,
                        valid: square.valid,
                    };
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
            rows: Array(boardSize).fill({squares:Array(boardSize).fill({
                inactivePiecePlayerNumber: null, 
                activePiecePlayerNumber: null, 
                inactivePieceIndex: null,
                activePieceIndex: null,
                valid: null,
            })}),
            pieces: makePieces({
                playerNumber: 0, 
                boardNumber: 0,
            }),
            activePieceIndex: null,
            xIsNext: true,
        }
    }

    // takes a piece and draws it on the board, in terms of rows/columns
    piecesToCells(pieces, rows, action) {
        pieces.forEach((piece) => {
            piece.cells.forEach(cell => {
                const xCoord = piece.centerX + cell[0];
                const yCoord = piece.centerY + cell[1];
                if (action === 'drawInactive') { // draw fixed piece
                    rows = update(rows, {[yCoord]:{squares:{[xCoord]:{$merge: {
                        inactivePiecePlayerNumber: piece.playerNumber,  
                        inactivePieceIndex: piece.pieceIndex,
                    }}}}});
                } else if (action === 'eraseInactive') {
                    rows = update(rows, {[yCoord]:{squares:{[xCoord]:{$merge: {
                        inactivePiecePlayerNumber: null,  
                        inactivePieceIndex: null,
                    }}}}});
                } else if (action === 'drawActive') { // draw temp piece
                    rows = update(rows, {[yCoord]:{squares:{[xCoord]:{$merge: {
                        activePiecePlayerNumber: piece.playerNumber,  
                        activePieceIndex: piece.pieceIndex,
                        valid: piece.valid,
                    }}}}});
                } else if (action === 'eraseActive') {
                    rows = update(rows, {[yCoord]:{squares:{[xCoord]:{$merge: {
                        activePiecePlayerNumber: null,  
                        activePieceIndex: null,
                        valiid: null,
                    }}}}});
                } else {
                    debugger;
                    console.log(`Error in pieceToCells - invalid action '${action}'`)
                }
            });
        });
        return rows;
    }

    componentDidMount() {
        // initialize board
        const rows = this.state.rows
        const pieces = this.state.pieces;
        const newRows = this.piecesToCells(pieces,rows, 'drawInactive');
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

        let piece = this.state.pieces.slice(this.state.activePieceIndex, this.state.activePieceIndex + 1);
        const erasedrows = this.piecesToCells(piece, rows, 'eraseActive'); 
        debugger;
        // perform transformation       
        piece = this[control](piece[0]);
        piece.valid = this.validLocation(piece);
        debugger;
        const drawnRows = this.piecesToCells([piece], erasedrows, 'drawActive');

        this.setState({
            rows: drawnRows,
        })
        // set state with new pieces, 
    }
    // function will test if location is valid.
    validLocation(piece) {
        debugger;
        const rows = this.state.rows;
        let cornerTouch = false;
        piece.cells.forEach(cell => {
            const x = piece.centerX + cell[0];
            const y = piece.centerY + cell[1];
            // test non-overlap
            if (rows[y].squares[x].inactivePiecePlayerNumber !== null) {
                return false;
            // test sides touch same player's pieces
            } else if ( (rows[y + 1] && rows[y + 1].squares[x] && rows[y + 1].squares[x].inactivePiecePlayerNumber === piece.playerNumber) 
                || (rows[y - 1] && rows[y - 1].squares[x] && rows[y - 1].squares[x].inactivePiecePlayerNumber === piece.playerNumber)
                || (rows[y].squares[x + 1] && rows[y].squares[x + 1].inactivePiecePlayerNumber === piece.playerNumber)
                || (rows[y].squares[x - 1] && rows[y].squares[x - 1].inactivePiecePlayerNumber === piece.playerNumber)
            ){
                return false;
            // test if one corner touches
            } else if ((rows[y + 1] && rows[y + 1].squares[x + 1] && rows[y + 1].squares[x + 1].inactivePiecePlayerNumber === piece.playerNumber) 
                || (rows[y + 1] && rows[y + 1].squares[x - 1] && rows[y + 1].squares[x - 1].inactivePiecePlayerNumber === piece.playerNumber)
                || (rows[y - 1] && rows[y - 1].squares[x + 1] && rows[y - 1].squares[x + 1].inactivePiecePlayerNumber === piece.playerNumber)
                || (rows[y - 1] && rows[y - 1].squares[x -1] && rows[y - 1].squares[x -1].inactivePiecePlayerNumber === piece.playerNumber)
            ){
                cornerTouch = true;
            }
        }); 
        return cornerTouch;
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
        const pieceIndex = rows[centerY].squares[centerX].inactivePieceIndex;
        const pieces = this.state.pieces.slice();

        let newPieces = [];
        let newRows = [];
        let activePieceIndex = this.state.activePieceIndex;

        // 'pick up' piece
        if (pieceIndex !== null && activePieceIndex === null) {
            newPieces = update(pieces, {[pieceIndex]:{$merge:{
                active: true
            }}});
            
            const erasedRows = this.piecesToCells([newPieces[pieceIndex]], rows, 'eraseInactive');
            newRows = this.piecesToCells([newPieces[pieceIndex]], erasedRows, 'drawActive');
            activePieceIndex = pieceIndex;

        // put piece down
        } else if (activePieceIndex !== null && this.validLocation(pieces[activePieceIndex])) {
            newPieces = pieces;
            const erasedRows = this.piecesToCells([pieces[activePieceIndex]], rows, 'eraseActive');
            newRows = this.piecesToCells([pieces[activePieceIndex]], erasedRows, 'drawInactive');
            activePieceIndex = null;   
        //do nothing
        } else { 
            newPieces = pieces;
            newRows = rows;
        }

        this.setState({
            pieces: newPieces,
            activePieceIndex: activePieceIndex,
            rows: newRows,
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
          pieceIndex: 0,
          centerX: 1,
          centerY: 1,
          active: false,
          cells: [[0,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 1,
          centerX: 3,
          centerY: 1,
          active: false,
          cells: [[0,0], [0,1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 2,
          centerX: 5,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [0,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 3,
          centerX: 7,
          centerY: 1,
          active: false,
          cells: [[0,0], [0,1], [1,0]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 4,
          centerX: 10,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [1,0], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 5,
          centerX: 13,
          centerY: 2,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 6,
          centerX: 1,
          centerY: 4,
          active: false,
          cells: [[0,0], [0,1], [0,2], [1,0]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 7,
          centerX: 4,
          centerY: 5,
          active: false,
          cells: [[0,0], [0,1], [1,1], [1,0]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 8,
          centerX: 7,
          centerY: 5,
          active: false,
          cells: [[0,0], [0,1], [1,0], [1,-1], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 9,
          centerX: 10,
          centerY: 6,
          active: false,
          cells: [[1,1], [0,1], [1,0], [1,-1], [0,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 10,
          centerX: 1,
          centerY: 9,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1], [1,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 11,
          centerX: 12,
          centerY: 14,
          active: false,
          cells: [[0,0], [1,0], [0,1], [0,-1], [-1,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 12,
          centerX: 13,
          centerY: 8,
          active: false,
          cells: [[0,0], [0,1], [0,2], [0,-1], [0,-2]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 13,
          centerX: 4,
          centerY: 9,
          active: false,
          cells: [[0,0], [0,1], [-1,1], [0,-1], [1,-1]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 14,
          centerX: 2,
          centerY: 14,
          active: false,
          cells: [[-1,-1], [-1,0], [-1,1], [0,-1], [1,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 15,
          centerX: 7,
          centerY: 9,
          active: false,
          cells: [[0,0], [-1,0], [-1,1], [0,-1], [1,-1]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 16,
          centerX: 9,
          centerY: 11,
          active: false,
          cells: [[0,0], [-1,0], [-1,1], [0,-1], [0,-2]],
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 17,
          centerX: 11,
          centerY: 11,
          active: false,
          cells: [[0,0], [1,0], [0,1], [0,-1], [0,-2]], 
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 18,
          centerX: 6,
          centerY: 14,
          active: false,
          cells: [[0,0], [1,0], [-1,1], [0,-1], [-1,0]],  
        },
        {
          boardNumber: props.boardNumber,
          playerNumber: props.playerNumber,
          pieceIndex: 19,
          centerX: 9,
          centerY: 14,
          active: false,
          cells: [[0,0], [0,1], [-1,1], [0,-1], [1,1]],
        },
    ]
}