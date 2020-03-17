import React from 'react';
import { Canvas } from 'react-three-fiber';
import { Cubel } from 'geometry/Cubel';
// import styles from './App.module.css';

export const App = () => {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10,10,10]} />
      <Cubel position={[-1.2, 0, 0]} />
      <Cubel position={[1.2, 0, 0]} />
    </Canvas>
  );
}
