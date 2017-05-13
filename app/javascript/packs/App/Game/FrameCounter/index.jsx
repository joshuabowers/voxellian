import React from 'react'
import styles from './styles'

const FrameCounter = props => (
  <div className='frame-counter'>
    <span>{ props.resolution.width }</span> / <span>{ props.resolution.height }</span> @ <span>{ props.framesPerSecond }</span> FPS
  </div>
);

export default FrameCounter;
