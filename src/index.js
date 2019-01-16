import React from 'react';
import ReactDOM from 'react-dom';


import Game from './Game.js'

import './index.css';


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



// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

