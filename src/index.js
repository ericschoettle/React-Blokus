import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

const boardSize = 20;
const numberPlayers = 4;

const pieceTemplate = [
    {
      centerX: 1,
      centerY: 1,
      cells: [[0,0]],  
    },
    {
      centerX: 3,
      centerY: 1,
      cells: [[0,0], [0,1]], 
    },
    {
      centerX: 5,
      centerY: 2,
      cells: [[0,0], [0,1], [0,-1]], 
    },
    {
      centerX: 7,
      centerY: 1,
      cells: [[0,0], [0,1], [1,0]],
    },
    {
      centerX: 10,
      centerY: 2,
      cells: [[0,0], [0,1], [1,0], [0,-1]],
    },
    {
      centerX: 13,
      centerY: 2,
      cells: [[0,0], [0,1], [0,2], [0,-1]],
    },
    {
      centerX: 1,
      centerY: 4,
      cells: [[0,0], [0,1], [0,2], [1,0]], 
    },
    {
      centerX: 4,
      centerY: 5,
      cells: [[0,0], [0,1], [1,1], [1,0]],
    },
    {
      centerX: 7,
      centerY: 5,
      cells: [[0,0], [0,1], [1,0], [1,-1], [0,-1]],
    },
    {
      centerX: 10,
      centerY: 6,
      cells: [[1,1], [0,1], [1,0], [1,-1], [0,-1]],
    },
    {
      centerX: 1,
      centerY: 9,
      cells: [[0,0], [0,1], [0,2], [0,-1], [1,-1]],
    },
    {
      centerX: 12,
      centerY: 14,
      cells: [[0,0], [1,0], [0,1], [0,-1], [-1,0]],  
    },
    {
      centerX: 13,
      centerY: 8,
      cells: [[0,0], [0,1], [0,2], [0,-1], [0,-2]],
    },
    {
      centerX: 4,
      centerY: 9,
      cells: [[0,0], [0,1], [-1,1], [0,-1], [1,-1]],
    },
    {
      centerX: 2,
      centerY: 14,
      cells: [[-1,-1], [-1,0], [-1,1], [0,-1], [1,-1]], 
    },
    {
      centerX: 7,
      centerY: 9,
      cells: [[0,0], [-1,0], [-1,1], [0,-1], [1,-1]], 
    },
    {
      centerX: 9,
      centerY: 11,
      cells: [[0,0], [-1,0], [-1,1], [0,-1], [0,-2]],
    },
    {
      centerX: 11,
      centerY: 11,
      cells: [[0,0], [1,0], [0,1], [0,-1], [0,-2]], 
    },
    {
      centerX: 6,
      centerY: 14,
      cells: [[0,0], [1,0], [-1,1], [0,-1], [-1,0]],  
    },
    {
      centerX: 9,
      centerY: 14,
      cells: [[0,0], [0,1], [-1,1], [0,-1], [1,1]],
    },
];

function Square(props) {
    const inactivePieceString = props.squareInfo.inactivePiecePlayerIndex === null ? '' : ' setPlayer' + props.squareInfo.inactivePiecePlayerIndex;
    const activePieceString = props.squareInfo.activePiecePlayerIndex === null ? '' : ' activePlayer' + props.squareInfo.activePiecePlayerIndex;    
    const validLocationString = (props.squareInfo.valid === false) ? ' invalid' : '';

    return (
        <button
            className={`square${inactivePieceString}${activePieceString}${validLocationString}`}
            onClick={props.onClick}>
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
            // this is ugly - I'm doing a bunch of work to recreate rows. Can I pass in the <Row/> itself to props, and just grab that? Or can I call get rows from here?
            // OR, can I make the board's get cells function available here, and call it? Would be kinda cool to just pass inidicies and call as needed. 
            rows.push(<Row 
                key ={i} 
                rowIndex = {i} 
                squares = {this.props.rows[i].map(square => {
                    return {
                        inactivePiecePlayerIndex: square.inactivePiecePlayerIndex,
                        activePiecePlayerIndex: square.activePiecePlayerIndex,
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
            cells: this.makeCells({
                inactivePiecePlayerIndex: null, 
                activePiecePlayerIndex: null, 
                inactivePieceIndex: null,
                activePieceIndex: null,
                valid: null,
            }),
            pieces: this.makePieces(),
            activePieceIndex: null,
            xIsNext: true,
        }
    }

    makeCells(defaultObj){
        let array = [];
        let index = 0;
        for (let i = 0; i < numberPlayers; i++) {
            for (let j = 0; j < boardSize; j++) {
                for (let k = 0; k < boardSize; k++) {
                    let cell = {
                        ...defaultObj,
                        boardIndex: i,
                        rowIndex: j,
                        colIndex: k,
                        index: index,
                    }
                    array.push(cell);
                    index += 1;
                }            
            }   
        }
        return array;
    }

    makePieces() {
        let pieceIndex = 0;
        let pieces = [];
        for (let playerIndex = 0; playerIndex < numberPlayers; playerIndex++) {
            for (let i = 0; i < pieceTemplate.length; i++) {
                const piece = pieceTemplate[i];
                pieces.push({
                    ...piece,
                    playerIndex: playerIndex,
                    boardIndex: playerIndex,
                    pieceIndex: pieceIndex,
                });
                pieceIndex += 1;
            }
        }
        return pieces;
    }

    // takes a piece and draws it on the board, in terms of rows/columns
    piecesToCells(pieces, cells, action) {
        pieces.forEach((piece) => {
            const boardIndex = piece.boardIndex;
            piece.cells.forEach(cell => {
                const xCoord = piece.centerX + cell[0];
                const yCoord = piece.centerY + cell[1];
                // todo: use case/break syntax
                if (action === 'drawInactive') { // draw fixed piece                    
                    let oldCell = this.getCells(yCoord, xCoord, boardIndex);
                    cells = update(cells, {[oldCell.index]:{$merge: {
                        inactivePiecePlayerIndex: piece.playerIndex,  
                        inactivePieceIndex: piece.pieceIndex,
                    }}});
                } else if (action === 'eraseInactive') {
                    let oldCell = this.getCells(yCoord, xCoord, boardIndex);
                    cells = update(cells, {[oldCell.index]:{$merge: {
                        inactivePiecePlayerIndex: null,  
                        inactivePieceIndex: null,
                    }}});
                } else if (action === 'drawActive') { // draw temp piece
                    let oldCell = this.getCells(yCoord, xCoord, boardIndex);
                    cells = update(cells, {[oldCell.index]:{$merge: {
                        activePiecePlayerIndex: piece.playerIndex,  
                        activePieceIndex: piece.pieceIndex,
                        valid: piece.valid,
                    }}});
                } else if (action === 'eraseActive') {
                    let oldCell = this.getCells(yCoord, xCoord, boardIndex);
                    cells = update(cells, {[oldCell.index]:{$merge: {
                        activePiecePlayerIndex: null,  
                        activePieceIndex: null,
                        valid: null,
                    }}});
                } else {
                    console.log(`Error in pieceToCells - invalid action '${action}'`)
                }
            });
        });
        return cells;
    }

    componentDidMount() {
        // initialize board
        const cells = this.state.cells;
        const pieces = this.state.pieces;
        const newCells = this.piecesToCells(pieces, cells, 'drawInactive');
        this.setState({
            cells: newCells,
        })
    }

    render() {
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

        let boards = [];
        for (let i = 0; i < numberPlayers; i++) {
            const rows = this.getRows(i);
            boards.push(
                <div className="game-board">
                    <Board
                        key={i}
                        boardIndex = {i}
                        rows={rows}
                        onClick={(x,y) => this.handleClick(x,y,i)}
                    />
                </div>
            )
        }

        return (
            <div className="game">
                {boards}
                <div className="game-controls">
                    <ul>{controlsJSX}</ul> 
                </div>
            </div>  
        );
    }

    getRows(boardIndex) {
        let rows = [];
        for (let i = 0; i < boardSize; i++) {
            rows.push(this.getCells(i, null, boardIndex));
        }
        return rows;
    }

    getCells(rowIndex, colIndex, boardIndex) {
        let cells = this.state.cells.filter(cell => {
            let match = true;
            // true if match or unspecified
            match = (match && (typeof rowIndex !== 'number' || rowIndex === cell.rowIndex));
            match = (match && (typeof colIndex !== 'number' || colIndex === cell.colIndex));
            match = (match && (typeof boardIndex !== 'number' || boardIndex === cell.boardIndex));
            return match;
        });
        if (cells.length === 1) {
            cells = cells[0];
        } else if (cells.length === 0) {
            cells = null;
        }
        return cells
    }

    flatten(array) {
        return array.reduce((flat, toFlatten) => {
            return flat.concat(Array.isArray(toFlatten) ? this.flatten(toFlatten) : toFlatten);
        }, []);
    }

    movePiece(control) {
        const cells = this.state.cells

        let piece = this.state.pieces.slice(this.state.activePieceIndex, this.state.activePieceIndex + 1); // why slice rather than grabbing by index directly? Some weird immutability thing?

        const erasedCells = this.piecesToCells(piece, cells, 'eraseActive'); 
        // perform transformation       
        piece = this[control](piece[0]);
        piece.valid = this.validLocation(piece);

        const newCells = this.piecesToCells([piece], erasedCells, 'drawActive');

        this.setState({
            cells: newCells,
        })
        // set state with new pieces, 
    }
    // function will test if location is valid.
    validLocation(piece) {
        let cornerTouch = false;
        let invalidSquare = false;
        const boardIndex = piece.boardIndex;
        piece.cells.forEach(cell => {
            const x = piece.centerX + cell[0];
            const y = piece.centerY + cell[1];
            const center = this.getCells(y, x, boardIndex);
            const sides = [
                this.getCells(y + 1, x, boardIndex),
                this.getCells(y - 1, x, boardIndex),
                this.getCells(y, x + 1, boardIndex),
                this.getCells(y, x - 1, boardIndex),
            ];

            const corners = [
                this.getCells(y + 1, x + 1, boardIndex),
                this.getCells(y - 1, x + 1, boardIndex),
                this.getCells(y + 1, x - 1, boardIndex),
                this.getCells(y - 1, x - 1, boardIndex),
            ];

            // test non-overlap
            if (center.inactivePiecePlayerIndex !== null) {
                return invalidSquare = true;
            // test if any sides touch the same piece
            } else if (sides.some( side => { return side && side.inactivePiecePlayerIndex === piece.playerIndex} ) ){
                return invalidSquare = true;
            // test if at least one corner touches
            } else if ( corners.some( corner => corner && corner.inactivePiecePlayerIndex === piece.playerIndex) ){
                cornerTouch = true;
            }
        }); 
        return (!invalidSquare && cornerTouch); // no invalid pieces and one corner touching
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


    handleClick(centerX, centerY, boardIndex) {
        const cells = this.state.cells;
        const cell = this.getCells(centerY, centerX, boardIndex);
        debugger;
        const pieceIndex = cell.inactivePieceIndex;
        const pieces = this.state.pieces.slice();
        let newPieces = [];
        let newCells = [];
        let activePieceIndex = this.state.activePieceIndex;

        // 'pick up' piece
        if (pieceIndex !== null && activePieceIndex === null) {
            newPieces = update(pieces, {[pieceIndex]:{$merge:{
                active: true
            }}});
            
            const erasedCells = this.piecesToCells([newPieces[pieceIndex]], cells, 'eraseInactive');
            newCells = this.piecesToCells([newPieces[pieceIndex]], erasedCells, 'drawActive');
            activePieceIndex = pieceIndex;

        // put piece down
        } else if (activePieceIndex !== null && this.validLocation(pieces[activePieceIndex])) {
            newPieces = pieces;
            const erasedCells = this.piecesToCells([pieces[activePieceIndex]], cells, 'eraseActive');
            newCells = this.piecesToCells([pieces[activePieceIndex]], erasedCells, 'drawInactive');
            activePieceIndex = null;   
        //do nothing
        } else { 
            newPieces = pieces;
            newCells = cells;
        }

        this.setState({
            pieces: newPieces,
            activePieceIndex: activePieceIndex,
            cells: newCells,
        });
    }
}



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

