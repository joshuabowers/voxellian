import React, { FunctionComponent } from 'react';
import styles from './ToolTip.module.css';

export interface ToolTipProps {
  isVisible: boolean;
  title: string;
}

export const ToolTip: FunctionComponent<ToolTipProps> = (props) => {
  const type = [styles.toolTip, props.isVisible && styles.visible].join(' ');
  return (
    <section className={type}>
      <h1>{props.title}</h1>
      {props.children}
    </section>
  )
}