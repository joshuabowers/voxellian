import React from 'react'
import styles from './styles'

const FrameCounter = props => {
  const { resolution: { width: w, height: h }, framesPerSecond } = props;
  return (
    <div className='frame-counter'>
      <span>{ w }</span> / <span>{ h }</span> @ <span>{ framesPerSecond }</span> FPS
    </div>
  );
}

export default FrameCounter;
