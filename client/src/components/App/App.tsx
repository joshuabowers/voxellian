import React from 'react';
import { Canvas } from 'react-three-fiber';
import { SceneSetup } from 'geometry/SceneSetup';
import { Sector } from 'geometry/Sector';

export const App = () => {
  return (
    // <Canvas orthographic camera={{position: [0,1,1], near: -20}}>
    <Canvas camera={{position: [0,5,5]}}>
      <SceneSetup />
      <Sector />
    </Canvas>
  )
};
