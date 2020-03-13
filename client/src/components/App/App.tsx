import React from 'react';
import { Canvas } from 'react-three-fiber';
import styles from './App.module.css';

export const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10,10,10]} />
    </Canvas>
  );
}
