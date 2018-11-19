import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import update from 'immutability-helper';

/** To DO list
 * 
 * Aesthetics:
 *  - Dynamic sizing!!!
 *  - Remove corner coloring after first round
 *  - Center buttons to remove player, etc. 
 * 
 * Readme
 * 
 * Heroku
 * 
 * Code cleaning:
 *  - Move "return to board" off of the move piece function. 
 *  - Clear up terminology of square vs. Cell
 *  - switch [0,1] to {x: 0, y: 1}
 *  - maybe: clean up rows/column leading to y,x. 
 *  - See if I can fix the ugly in rows where I'm recreating squares. 
 *  - Split into multiple files
 * 
 * Other: 
 *   - Link to github/my website
*/

const playerBoardSize = 17;
const sharedBoardSize = 20;
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

const boardCorners = [{x: 0, y: 0}, {x: sharedBoardSize-1, y: sharedBoardSize-1}, {x: 0, y: sharedBoardSize-1}, {x: sharedBoardSize-1, y: 0}];

function Square(props) {
    const cornerString = typeof props.squareInfo.corner !== 'number' ? '' : ' corner' + props.squareInfo.corner;
    const inactivePieceString = typeof props.squareInfo.inactivePiecePlayerIndex !== 'number' ? '' : ' setPlayer' + props.squareInfo.inactivePiecePlayerIndex;
    const activePieceString =  typeof props.squareInfo.activePiecePlayerIndex !== 'number' ? '' : ' activePlayer' + props.squareInfo.activePiecePlayerIndex;    
    const validLocationString = (props.squareInfo.valid === false) ? ' invalid' : '';

    return (
        <td
            className={`${cornerString}${inactivePieceString}${activePieceString}${validLocationString}`}
            onClick={props.onClick}>
        </td>
    );
}

class Row extends React.Component {
    render () {
        let squares = [];
        for (let j = 0; j < this.props.squares.length; j++) {
            squares.push(<Square 
                key ={j} 
                onClick={() => this.props.onClick(j, this.props.rowIndex)}
                squareInfo = {this.props.squares[j]} // Naming here is temporary - passing the value in player number, rather than the whole object, to make testing easier
            />)
        }
        return (
            <tr>
                {squares}
            </tr>
        )
    }
}

class Board extends React.Component {
    render() {
        // Setup buttons
        let button; 
        if (this.props.active && this.props.activePieceIndex !== null) {
            button = 
                <button className="btn btn-primary btn-sm" onClick = {() => this.props.movePiece('returnToBoard')}>
                    Return Piece to Board
                </button>
        } else if (this.props.active) {
            button = 
                <button className="btn btn-primary btn-sm" onClick = {() => this.props.removePlayer()}>
                    No more moves
                </button>
        }

        let rows = [];
        for (let i = 0; i < this.props.rows.length; i++) {
            // this is ugly - I'm doing a bunch of work to recreate rows. Can I pass in the <Row/> itself to props, and just grab that? Or can I call get rows from here?
            // OR, can I make the board's get cells function available here, and call it? Would be kinda cool to just pass inidicies and call as needed. 
            rows.push(<Row 
                key ={i} 
                rowIndex = {i} 
                squares = {this.props.rows[i].map(square => {
                    return {...square};
                })}
                onClick = {this.props.onClick}/>)
        } 
        return (
            <div className={this.props.shared ? "col-6" : "col-3"}>
                <table className={this.props.shared ? "shared-board" : (this.props.active ? "player-board active" : "player-board")}>
                    <tbody>
                        {rows}
                    </tbody>
                    <caption>{(this.props.finalScore) ? `Final Score: ${this.props.finalScore}` : button}</caption>
                </table>
            </div>
        );
    }
}

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
            players: Array(numberPlayers).fill({
                finalScore: null,
                name: null,
            }),
            currentPlayer: 0,
            currentPlayers: [0,1,2,3],
        }
    }

    makeCells(defaultObj){
        let array = [];
        let index = 0;
        for (let i = 0; i < numberPlayers; i++) {
            for (let j = 0; j < playerBoardSize; j++) {
                for (let k = 0; k < playerBoardSize; k++) {
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
        for (let j = 0; j < sharedBoardSize; j++) {
            for (let k = 0; k < sharedBoardSize; k++) {
                let corner = null;
                boardCorners.forEach((boardCorner, index) => { 
                    if (boardCorner.x === j && boardCorner.y === k) {
                        corner = index;
                    }
                });
                let cell = {
                    ...defaultObj,
                    boardIndex: numberPlayers,
                    rowIndex: j,
                    colIndex: k,
                    index: index,
                    corner: corner,
                }
                array.push(cell);
                index += 1;
            }            
        }   
        return array;
    }

    keyDownHandler(key) {
        const keyToActionMap = {
            ArrowUp: 'moveUp',
            ArrowDown: 'moveDown',
            ArrowRight: 'moveRight',
            ArrowLeft: 'moveLeft',
            KeyF: 'rotClock', 
            KeyS: 'rotCounterClock', 
            KeyE: 'flipV', 
            KeyD: 'flipH',
            Space: 'putDownPiece'
        }

        const action = keyToActionMap[key.code]

        if (this.state.activePieceIndex && action) { // If there isn't an active piece, or the key is invalid, do nothing. 
            if (action === 'putDownPiece' && this.validLocation(this.state.pieces[this.state.activePieceIndex])) {
                this.putDownPiece(this.state.activePieceIndex);
                // Advance player unless last piece 
                if (this.remainingPoints()) {
                    this.advancePlayer();
                } else {
                    this.removePlayer();
                }
            } else {
                this.movePiece(action);
            } 
        }   
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
        if (pieces.constructor !== Array) {
            pieces = [pieces];
        }
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
        document.addEventListener("keydown", this.keyDownHandler.bind(this));
    }

    render() {
        // Set up boards
        let playerBoards = [];
        for (let i = 0; i < numberPlayers; i++) {
            const rows = this.getRows(i);
            playerBoards.push(
                <Board
                    key={i}
                    finalScore = {(i < numberPlayers) ? this.state.players[i].finalScore: null}
                    active={this.state.currentPlayer === i}
                    activePieceIndex={this.state.activePieceIndex}
                    movePiece={this.movePiece.bind(this)}
                    removePlayer={this.removePlayer.bind(this)}
                    shared={numberPlayers === i}
                    rows={rows}
                    onClick={(x,y) => this.handleClick(x,y,i)}
                />
            )
        }
        const sharedRows = this.getRows(numberPlayers);
        let sharedBoard =       
            <Board
                key={numberPlayers}
                finalScore ={null}
                active={false}
                shared={true}
                rows={sharedRows}
                onClick={(x,y) => this.handleClick(x,y,numberPlayers)}
            />
        

        return (
            <div className="container" onKeyDown={this.keyDownHandler}>
                <div className="header">
                    <div className="text-center"> 
                        <h1><b>Blockus</b><span className="asterisk">*</span></h1>
                    </div>
                    <div className="how-to"> 
                        <div>
                            <b>Rules:</b>
                            <div><br /></div>
                            <ul>
                                <li>Play rotates through players</li>
                                <li>Starting pieces must be played in the corner matching the player's color.</li>
                                <li>Pieces can only be played where they touch at least one of the same players pieces corner-to-corner, do not touch the same players pieces side-to-side, and do not overlap with other player's pieces</li>
                                <li>The player with the fewest unplayed pieces at the end wins!</li>
                            </ul>
                        </div>

                        <div>
                            <b>How to move pieces:</b>
                            <div><br /></div>
                            <ul>
                                <li>Click on piece to move to game board</li>
                                <li>Arrow keys to move piece</li>
                                <li>"F" to rotate clockwise, "S" to rotate counter-clockwise</li>
                                <li>"A" to flip vertically, "D" to flip horizontally</li>
                                <li>Space bar to place a piece and advance to next player</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="game">
                    <div className="row">
                        {playerBoards}
                    </div>
                    <div className="row justify-content-center">
                        {sharedBoard}
                    </div>
                </div> 
                <div className="disclaimer"> 
                    <p>* Please, if you happen to be associated with Blokus (tm), don't fuss over this little thing. 
                        It's just a simple side project by an admirer of your game. It's challenging and elegant, easy to learn and hard to master.
                        I built it to have fun and learn React - I have no intention to make a profit here. Thanks for understanding!
                    </p>
                </div>
            </div>
        );
    }

    getRows(boardIndex) {
        let rows = [];
        if (boardIndex === numberPlayers) {
            for (let i = 0; i < sharedBoardSize; i++) {
                rows.push(this.getCells(i, null, boardIndex));
            }
        } else {
            for (let i = 0; i < playerBoardSize; i++) {
                rows.push(this.getCells(i, null, boardIndex));
            }
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

    movePiece(action) {
        const cells = this.state.cells
        let newCells = [];
        let activePieceIndex = this.state.activePieceIndex;
        let piece = this.state.pieces[this.state.activePieceIndex]

        // Erase cells before moving piece
        const erasedCells = this.piecesToCells(piece, cells, 'eraseActive'); 

        // perform transformation on piece      
        piece = this[action](piece);
        piece.valid = this.validLocation(piece);

        if (action === 'returnToBoard') {
            newCells = this.piecesToCells([piece], erasedCells, 'drawInactive');
            activePieceIndex = null;
        } else {
            newCells = this.piecesToCells([piece], erasedCells, 'drawActive');
        }

        this.setState({
            cells: newCells,
            activePieceIndex: activePieceIndex,
        })
    }

    // function tests if location is valid.
    // Need to make it accept first piece in corner, and each player gets their corner. 
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
            // test if piece is in corner OR at least one corner touches the same player's corner
            } else if ( (x === boardCorners[piece.playerIndex].x && y === boardCorners[piece.playerIndex].y ) || corners.some( corner => corner && corner.inactivePiecePlayerIndex === piece.playerIndex) ){
                cornerTouch = true;
            }
        }); 
        return (!invalidSquare && cornerTouch); // no invalid pieces and one corner touching
    }

    testCellOffBoard(piece) {
        return function(cell, index, array) {
            return (piece.centerX + cell[0] < 0 || piece.centerY + cell[1] < 0 || piece.centerX + cell[0] >= sharedBoardSize || piece.centerY + cell[1] >= sharedBoardSize)
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

    returnToBoard(piece) {
        const template = pieceTemplate[piece.pieceIndex % pieceTemplate.length]
        piece.centerX = template.centerX;
        piece.centerY = template.centerY;
        piece.boardIndex = piece.playerIndex;

        return piece;
    }

    removePlayer() {
        let currentPlayers = this.state.currentPlayers;
        const currentPlayer = this.state.currentPlayer;

        // remove player
        const currentPlayerIndex = currentPlayers.indexOf(currentPlayer)
        currentPlayers.splice(currentPlayerIndex, 1);

        this.setState({
            currentPlayers: currentPlayers,
        });

        this.advancePlayer()
    }

    advancePlayer() {
        let currentPlayers = this.state.currentPlayers;
        let currentPlayer = this.state.currentPlayer;

        let nextPlayerIndex = (currentPlayers.indexOf(currentPlayer) + 1) % currentPlayers.length;
        currentPlayer = currentPlayers[nextPlayerIndex];
        if (!currentPlayer) {
            this.endGame();
        }

        this.setState({
            currentPlayer: currentPlayer
        })
    }

    endGame() {
        const players = this.state.players.map((player, i) => {
            return {
                ...player,
                finalScore: this.remainingPoints(i)
            };
        });
        this.setState({
            players: players
        });
    }

    remainingPoints(playerIndex) {
        let pieces = this.state.pieces
        let score = pieces.reduce((sum, piece) => {
            if (piece.playerIndex === playerIndex && piece.boardIndex === playerIndex) {
                return sum += piece.cells.length;
            } else {
                return sum;
            }
        }, 0)
        return score;
    }

    pickUpPiece(pieceIndex, destinationBoardIndex) {
        const cells = this.state.cells;
        const pieces = this.state.pieces;
        const erasedCells = this.piecesToCells([pieces[pieceIndex]], cells, 'eraseInactive');

        const newPieces = update(pieces, {[pieceIndex]:{$merge:{
            centerX: Math.round(sharedBoardSize/2),
            centerY: Math.round(sharedBoardSize/2),
            valid: this.validLocation(pieces[pieceIndex]),
            active: true,
            boardIndex: destinationBoardIndex,
        }}});

        const newCells = this.piecesToCells([newPieces[pieceIndex]], erasedCells, 'drawActive');
        this.setState({
            cells: newCells,
            pieces: newPieces,
            activePieceIndex: pieceIndex
        });
    }

    putDownPiece(pieceIndex) {
        const cells = this.state.cells;
        const pieces = this.state.pieces;
        const erasedCells = this.piecesToCells([pieces[pieceIndex]], cells, 'eraseActive');

        const newPieces = update(pieces, {[pieceIndex]:{$merge:{
            active: false,
        }}});
        const newCells = this.piecesToCells([newPieces[pieceIndex]], erasedCells, 'drawInactive');
        this.setState({
            cells: newCells,
            pieces: newPieces,
            activePieceIndex: null,
        });
    }

    handleClick(centerX, centerY, boardIndex) {
        let currentPlayer = this.state.currentPlayer;

        const cell = this.getCells(centerY, centerX, boardIndex);
        const pieceIndex = cell.inactivePieceIndex;

        const pieces = this.state.pieces.slice();
        let activePieceIndex = this.state.activePieceIndex;

        if (boardIndex === currentPlayer && pieceIndex !== null && activePieceIndex === null) {
            this.pickUpPiece(pieceIndex, numberPlayers); 

        } else if (activePieceIndex !== null && this.validLocation(pieces[activePieceIndex])) {
            this.putDownPiece(activePieceIndex);
            activePieceIndex = null;

            if (this.remainingPoints()) {
                this.advancePlayer();
            } else {
                this.removePlayer();
            }
        } 
    }
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);


