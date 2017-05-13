import React from 'react'
import styles from './styles'

const FrameCounter = props => (
  <div className='frame-counter'>{ props.framesPerSecond } FPS</div>
);

export default FrameCounter;
