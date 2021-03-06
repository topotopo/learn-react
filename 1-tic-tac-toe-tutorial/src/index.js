import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  if (props.isHighlight) {
    return (
      <button
        className='square highlighted'
        onClick={props.onClick}
        style={props.currentPosition ? { color: "green" } : { color: "black" }}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button
        className='square'
        onClick={props.onClick}
        style={props.currentPosition ? { color: "green" } : { color: "black" }}>
        {props.value}
      </button>
    );
  }
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        currentPosition={this.props.currentPosition == i}
        isHighlight={this.props.winnerSquares.includes(i)}
      />
    );
  }

  renderSquareRow() {
    var rowItems = [];
    var count = 0;

    for (var j = 0; j < 3; j++) {
      var squares = [];
      for (var i = 0; i < 3; i++) {
        squares.push(this.renderSquare(count++));
      }
      rowItems.push(<div className='board-row'>{squares}</div>);
    }
    return rowItems;
  }

  render() {
    return <div>{this.renderSquareRow()}</div>;
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      xIsNext: true,
      stepNumber: 0,
      positions: Array(9).fill(null),
    };
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: step % 2 === 0,
    });
  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    const positions = this.state.positions.slice(
      0,
      this.state.positions.length + 1
    );

    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    positions[history.length] = i;

    this.setState({
      history: history.concat([{ squares: squares }]),
      xIsNext: !this.state.xIsNext,
      stepNumber: history.length,
      positions: positions,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winnerSquares = calculateWinner(current.squares);
    const winner = Array.isArray(winnerSquares)
      ? current.squares[winnerSquares[0]]
      : null;
    const currentPosition = this.state.positions[this.state.stepNumber];

    let status;

    if (winner) {
      status = "Winner: " + winner;
    } else if (isAllSquaresFilled(current.squares)) {
      status = "Draw!";
    } else {
      status = "Next Player: " + (this.state.xIsNext ? "X" : "O");
    }

    const moves = history.map((step, move) => {
      const desc = move ? "Go to move #" + move : "Go to game start";
      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    return (
      <div className='game'>
        <div className='game-board'>
          <Board
            squares={current.squares}
            winnerSquares={winner ? winnerSquares : []}
            onClick={(i) => this.handleClick(i)}
            currentPosition={currentPosition}
          />
        </div>
        <div className='game-info'>
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function isAllSquaresFilled(squares) {
  return !squares.includes(null);
}

function calculateWinner(squares) {
  console.log("calculate winner");
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [a, b, c];
    }
  }
  return null;
}
