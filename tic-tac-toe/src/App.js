import { useState } from 'react';
import './App.css';

function Square({ index, value, onSquareClick, winningSquares}) {
  let winningSquare = false;
  if (winningSquares){
    winningSquare = winningSquares.includes(index);
  }

  return (
    <button 
      className={`square ${value ? value === 'X' ? 'playerX' : 'playerO' : ''} ${winningSquare ? value === 'X' ? 'playerXWin' : 'playerOWin' : ''}`} 
      onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i){
    //check if it already has been clicked so we don't overwrite, or someone has won already
    if (calculateWinner(squares) || squares[i]) {
      return
    }

    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    
    onPlay(nextSquares);
  }

  const winningSquares = calculateWinner(squares);
  const draw = calculateDraw(squares)
  let status;
  if (winningSquares) {
    status = 'Winner: ' + squares[winningSquares[0]];
  } else if (draw) {
    status = 'Draw';
  } else {
    status = 'Next Player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
  <>
  <div className="status">{status}</div>
  <div className="board-row">
    <Square index={0} value={squares[0]} onSquareClick={() => handleClick(0)} winningSquares={winningSquares} />
    <Square index={1} value={squares[1]} onSquareClick={() => handleClick(1)} winningSquares={winningSquares} />
    <Square index={2} value={squares[2]} onSquareClick={() => handleClick(2)} winningSquares={winningSquares} />
  </div>
  <div className="board-row">
    <Square index={3} value={squares[3]} onSquareClick={() => handleClick(3)} winningSquares={winningSquares} />
    <Square index={4} value={squares[4]} onSquareClick={() => handleClick(4)} winningSquares={winningSquares} />
    <Square index={5} value={squares[5]} onSquareClick={() => handleClick(5)} winningSquares={winningSquares} />
  </div>
  <div className="board-row">
    <Square index={6} value={squares[6]} onSquareClick={() => handleClick(6)} winningSquares={winningSquares} />
    <Square index={7} value={squares[7]} onSquareClick={() => handleClick(7)} winningSquares={winningSquares} />
    <Square index={8} value={squares[8]} onSquareClick={() => handleClick(8)} winningSquares={winningSquares} />
  </div>
    
  </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1)
  }

  function jumpTo(nextMove){
    setCurrentMove(nextMove);
  }

  const moves = history.map((squares, move) => {
    if (move == currentMove){
      return (
        <li key={move}>
          <p>You are at move #{move}</p>
        </li>
      );
    } else if (move > 0) {
      return (
        <li key={move}>
        <button className="game-btn" onClick={() => jumpTo(move)}>Go to move #{move}</button>
      </li>
      );
    }
  })

  return (
    <>
    <div className='container'>
      <div className='title'>
        <h1>Tic Tac Toe</h1>
      </div>
      <div className="game">
        <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
        </div>
        <div className="game-info">
          <div className='restart-btn'>
          <button className="game-btn" onClick={() => jumpTo(0)}>Restart game</button>
          </div>
          <ul>{moves}</ul>
        </div>
      </div>
    </div>
    </>
  );
}

function calculateWinner(squares) {
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
      return lines[i];
    }
  }
  return null;
}

function calculateDraw(squares) {
  return (!squares.includes(null));
}