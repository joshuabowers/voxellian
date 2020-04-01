import React from 'react';
import { Canvas } from 'react-three-fiber';
// import { Map } from 'geometry/Map';
import { SceneSetup } from 'geometry/SceneSetup';
import { Frustum } from 'geometry/Frustum';

// const gridTest = process.env.PUBLIC_URL + "/maps/hexagonal-grid-test.glb";

export const App = () => {
  return (
    <Canvas>
      <SceneSetup />
      <Frustum />
      {/* <Map url={gridTest} /> */}
    </Canvas>
  )
};
