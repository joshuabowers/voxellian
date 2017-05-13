import React from 'react'
import styles from './styles'
import ViewPort from './ViewPort'
import FrameCounter from './FrameCounter'

class Game extends React.Component {
  constructor( props ) {
    super( props )
    this.fpsCounter = { previousSecond: Date.now(), count: 1 };
    this.state = {
      framesPerSecond: 0,
      resolution: {
        width: 0,
        height: 0
      }
    };

    this.handleFrame = this.handleFrame.bind(this);
    this.handleResize = this.handleResize.bind(this);
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

  handleResize( newWidth, newHeight ) {
    this.setState( { resolution: { width: newWidth, height: newHeight } } );
  }

  render() {
    const framesPerSecond = this.state.framesPerSecond;
    const resolution = this.state.resolution;
    return (
      <div className='game'>
        <ViewPort onFrame={ this.handleFrame } onResize={ this.handleResize } />
        <FrameCounter framesPerSecond={ framesPerSecond } resolution={ resolution } />
      </div>
    );
  }
}

export default Game;
