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
      },
      mouse: null
    };

    this.handleFrame = this.handleFrame.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
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

  handleMouseMove( e ) {
    e.preventDefault();
    this.setState( { mouse: e } );
  }

  render() {
    const { framesPerSecond, resolution, mouse } = this.state;
    return (
      <div className='game'>
        <ViewPort onFrame={ this.handleFrame } onResize={ this.handleResize }
          onMouseMove={ this.handleMouseMove } mouse={ mouse } />
        <FrameCounter framesPerSecond={ framesPerSecond } resolution={ resolution } />
      </div>
    );
  }
}

export default Game;
