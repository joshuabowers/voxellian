import React from 'react'
import ReactDOM from 'react-dom'
import styles from './styles'
import Game from './Game'

const App = props => (
  <div className='app'>
    <div className='structural-support' />
    <Game />    
  </div>
)

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <App />,
    document.querySelector('main')
  )
})
