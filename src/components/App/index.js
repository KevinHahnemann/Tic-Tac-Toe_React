import React, {Component} from 'react';
import logo from '../../logo.svg';
import './index.css';

import {Field} from "../Field";
import Button from "../Button";

class Index extends Component {

  _winningConditions = [
    '012', '345', '678', // row
    '036', '147', '258', // column
    '048', '246' // diagonal
  ];
  _dangerConditions = [
    '01-2', '03-6', '12-0', '24-6', '25-8', '34-5', '36-0', '40-8', '41-7', '45-3', '46-2', '47-1', '48-0', '58-2', '67-8', '78-6',
    '02-1', '06-3', '08-4', '17-4', '26-4', '28-5', '35-4', '68-7'
  ];

  constructor(props) {
    super(props);
    this.state = {
      title_line1: 'Welcome to a little Game of Tic-Tac-Toe',
      title_line2: 'Powered by:',
      turn: 1,
      data_fields: ['','','','','','','','',''],
      win: '',
      draw: '',
    }

    this.onClick =
        this.onClick.bind(this);
  }

  onClick(id, type) {

    if(this.state.win === '' && this.state.draw === '') {

      // user set there x
      let data_fields = this.setDataField(id, type);
      // checks if move won the game
      let win = this.checkWinner(data_fields);
      if(win) {
        this.setState({win: this.checkWinner(data_fields)});
      } else {
        // computer set there o
        data_fields = this.computersTurn(data_fields);
        // checks if move resulted in a draw
        this.setState({draw: this.checkDraw(data_fields)});
        // checks if move won the game
        this.setState({win: this.checkWinner(data_fields)});
      }

      let turn = this.state.turn;
      this.setState({turn: turn+1})

    }

  }

  setDataField(id, type) {
    let data_fields = [...this.state.data_fields];
    let data_field = data_fields[id];

    if(data_field === '') {
      data_field = type;
    }

    data_fields[id] = data_field;

    this.setState({data_fields});

    return data_fields;
  }

  checkDraw(data_fields) {
    // check if 8 of 9 fields are full
    let indexes = [];
    for(let i=0; i<=8; i++) {
      if(data_fields[i] === '') {
        indexes.push(i)
      }
    }

    if(indexes.length <= 3) {
      // check if the last fields would result in player victory
      for(const value of indexes) {
        data_fields[value] = 'x';
      }
      const win = this.checkWinner(data_fields);
      for(const value of indexes) {
        data_fields[value] = '';
      }
      if(win === '') {
        return 'It\'s a draw';
      }
    }

    return '';
  }

  checkWinner(data_fields) {
    for(const value of this._winningConditions) {
      if(data_fields[value[0]] === 'x' && data_fields[value[1]] === 'x' && data_fields[value[2]] === 'x')  {
        return 'You win!';
      }
      if(data_fields[value[0]] === 'o' && data_fields[value[1]] === 'o' && data_fields[value[2]] === 'o')  {
        return 'The Computer wins!';
      }
    }
    return '';
  }

  computersTurn(data_fields) {
    // AI Stuff
    let wins = [];
    let counters = [];
    let turnTaken = false;
    let cornerKeys = [0,2,6,8];
    let wallKeys = [1,3,5,7];

    for(const value of this._dangerConditions) {
      // check if winning
      if(data_fields[value[0]] === 'o' && data_fields[value[1]] === 'o')  {
        wins.push(value[3])
      }
      // check if danger
      if(data_fields[value[0]] === 'x' && data_fields[value[1]] === 'x')  {
        counters.push(value[3])
      }
    }

    // acts on win
    if(wins.length >= 1) {
      for (const value of wins) {
        if(data_fields[value] === '' && turnTaken === false) {
          data_fields[value] = 'o';
          this.setState({data_fields});
          turnTaken = true;
        }
      }
    }
    // acts on danger
    if(counters.length >= 1 && turnTaken === false) {
      for (const value of counters) {
        if(data_fields[value] === '' && turnTaken === false) {
          data_fields[value] = 'o';
          this.setState({data_fields});
          turnTaken = true;
        }
      }
    }
    if(turnTaken === false) {
      // free placement
      let key = null;

      // first turn
      if(this.state.turn === 1) {
        // x center
        if(data_fields[4] === 'x') {
          let index = Math.floor(Math.random() * cornerKeys.length);
          key = cornerKeys[index];
        } else {
          // if x in corner or side/wall
          key = 4;
        }
      }

      // second turn
      if(this.state.turn === 2) {
        // x corner and opposing corner and o middle
        if((data_fields[0] === 'x' && data_fields[8] === 'x') || (data_fields[2] === 'x' && data_fields[6] === 'x')) {
          let index = Math.floor(Math.random() * wallKeys.length);
          key = wallKeys[index];
        }
        // x center and corner and o opposing corner
        if((data_fields[4] === 'x' && data_fields[0] === 'x' && data_fields[8] === 'o')
          || (data_fields[4] === 'x' && data_fields[8] === 'x' && data_fields[0] === 'o')) {
          key = 2;
        }
        if((data_fields[4] === 'x' && data_fields[2] === 'x' && data_fields[6] === 'o')
          || (data_fields[4] === 'x' && data_fields[6] === 'x' && data_fields[2] === 'o')) {
          key = 0;
        }
      }

      // third turn
      if(this.state.turn >= 3) {

        // get random corner or center
        let cornerCenterKeys = [0,2,4,6,8];
        while (cornerCenterKeys.length >= 1 && key === null) {
          //random select index
          let index = Math.floor(Math.random() * cornerCenterKeys.length);
          if(data_fields[cornerCenterKeys[index]] === '') {
            key = cornerCenterKeys[index];
          } else {
            cornerCenterKeys.splice(index, 1);
          }
        }

        // get first free field if all corners and center are occupied
        if(key === null) {
          for(let i=0; i<=8; i++) {
            if(data_fields[i] === '') {
              key = i;
            }
          }
        }
      }

      data_fields[key] = 'o';
      this.setState({data_fields});
    }

    return data_fields;
  }

  render() {
    const {title_line1, title_line2, data_fields, win, draw} = this.state;

    let returnData = [];

    for(let id = 0; id <= 8; id++) {
      returnData.push(
          <Field
              onClick={() => this.onClick(id,'x')}
              className="data-block"
          >
            {data_fields[id]}
          </Field>

      )
    }

    return (
      <div className="App">
        <header className="App-header">
          <h2>{title_line1}</h2>
          <h3>{title_line2} <img src={logo} className="App-logo" alt="logo" /></h3>
        </header>
        <div className="game-area">
          {returnData.map((field) => {
            return field;
          })}
        </div>
        {win !== ''
          ? <div className="end-message">{win}</div>
          : ''
        }
        {draw !== ''
            ? <div className="end-message">{draw}</div>
            : ''
        }
        {win !== '' || draw !== ''
            ? <Button
                onClick={this.gameRestart}
                className="restart-button"
            >
              Restart
            </Button>
            : ''
        }

      </div>
    );
  };
  
  gameRestart() {
    window.location.reload(false);
  }

}

export default Index;
