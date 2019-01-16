import React from 'react';
import Row from './Row.js';

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
              key={i} 
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

export default Board