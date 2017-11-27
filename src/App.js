import React, {Component} from 'react';
import _ from 'lodash'
import './App.css'

const winningCombos = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]]
const player = 'X'
const AI = 'O'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      board: ['', '', '', '', '', '', '', '', ''],
      winner: false,
      win: false
    }
  }

  render() {
    return (
      <div className="board">
        {!this.state.win ?
          this.state.board.map((el, ndx) => <div className='square' key={ndx} index={ndx} onClick={() => this.handleClick(ndx)}>{el}</div>) :

          <div className="board">{this.state.board.map((el, ndx) => <div className='square' key={ndx} index={ndx}>{el}</div>)}Game over! {this.state.winner}
          </div>
        }
        <div>
          <button onClick={() => this.handleRestart()} style={{marginTop: '25px'}}>Restart</button>
        </div>
      </div>
    );
  }

  handleRestart() {
    this.setState(() => {
      return {
        board: ['', '', '', '', '', '', '', '', ''],
        winner: false,
        win: false
      }
    })
  }

  checkForWinner(board) {
    let winner = winningCombos.find(function (combo) {
      if (board[combo[0]] !== "" && board[combo[1]] !== "" && board[combo[2]] !== "" && board[combo[0]] === board[combo[1]] && board[combo[1]] === board[combo[2]]) {
        return board[combo[0]]
      }
    })
    if (winner) return winner
    if (!winner && (board.filter(x => !x).length < 1)) {
      return 'DRAW'
    } else {
      return undefined
    }
  }

  handleClick(index) {
    if (!this.state.board[index]) {
      let currentBoard = this.state.board.slice()
      currentBoard[index] = 'X'
      let winner = this.checkForWinner(currentBoard, player)
      if (winner === 'DRAW') {
        this.setState(() => {
          return {
            win: true,
            winner: 'DRAW',
            board: currentBoard
          }
        })
        return
      }
      if (winner) {
        this.setState({
          board: currentBoard,
          win: true,
          winner: player
        })
        return
      }
      let aiMove = this.aiMove(currentBoard)
      currentBoard[aiMove] = 'O'
      winner = this.checkForWinner(currentBoard, AI)
      if (winner) {
        this.setState({
          board: currentBoard,
          win: true,
          winner: AI
        })
        return
      }
      this.setState(() => {
        return {
          board: currentBoard
        }
      })
    }
  }

  aiMove(currentBoard) {
    return this.findBestMove(currentBoard)
  }

  minimax(board, depth, currentPlayer) {
    const gameState = this.checkForWinner(board, currentPlayer)
    if (gameState === undefined) {
      const values = []
      for (let i = 0; i < 9; i++) {
        if (!board[i]) {
          const newBoard = board.slice()
          newBoard[i] = currentPlayer
          const value = this.minimax(newBoard, depth + 1, currentPlayer === player ? AI : player)
          values.push({
            value: value,
            cell: i
          })
        }
      }

      if (currentPlayer === AI) {
        const max = _.maxBy(values, v => {
          return v.value
        })
        if (depth === 0) {
          return max.cell
        } else {
          return max.value
        }
      } else {
        const min = _.minBy(values, v => {
          return v.value
        })
        if (depth === 0) {
          return min.cell
        } else {
          return min.value
        }
      }

    } else if (gameState === 'DRAW') {
      return 0
    } else if (board[gameState[0]] === 'X') {
      return depth - 10
    } else if (board[gameState[0]] === 'O') {
      return 10 - depth
    }
  }

  findBestMove(board) {
    return this.minimax(board, 0, AI)
  }
}

export default App;
