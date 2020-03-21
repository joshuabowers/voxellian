import React from 'react';
import styles from './ToolTip.module.css';

export interface ToolTipProps {
  isVisible: boolean
}

export const ToolTip = (props: ToolTipProps) => {
  const type = [styles.toolTip, props.isVisible && styles.visible].join(' ');
  return (
    <section className={type}>
      <h1>I'm part of a loaded map!</h1>
      <p>Mmm... hexagons. <b>drools</b></p>
    </section>
  )
}