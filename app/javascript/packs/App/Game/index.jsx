import React from 'react'
import styles from './styles'
import ViewPort from './view_port'
import FrameCounter from './FrameCounter'

class Game extends React.Component {
  constructor( props ) {
    super( props )
    this.fpsCounter = { previousSecond: Date.now(), count: 1 };
    this.state = { framesPerSecond: 0 };

    this.handleFrame = this.handleFrame.bind(this);
  }

  handleFrame( frameID ) {
    const currentTime = Date.now();
    const diff = currentTime - this.fpsCounter.previousSecond;
    if( diff >= 1000 ) {
      this.setState( { framesPerSecond: this.fpsCounter.count } );
      this.fpsCounter = {
        previousSecond: currentTime,
        count: 1
      }
    } else {
      this.fpsCounter.count++;
    }
  }

  render() {
    const framesPerSecond = this.state.framesPerSecond;
    return (
      <div className='game'>
        <ViewPort onFrame={ this.handleFrame } />
        <FrameCounter framesPerSecond={ framesPerSecond } />
      </div>
    );
  }
}

export default Game;
