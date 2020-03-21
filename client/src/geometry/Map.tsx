import React, { Suspense, useState } from 'react';
import { Hexel } from 'geometry/Hexel';
import { AssetProps, Asset } from 'geometry/Asset';
import { ToolTip } from 'components/ToolTip';
import { Dom } from 'react-three-fiber';
import { Vector3 } from 'three';

/**
 * Attempts to load a map from a GLTF asset located at url;
 * while the asset is unavailable, defaults to a rotation
 * hexagonal prism.
 * @param url the location of the map file. Should be within
 * the server public directory. 
 */
export const Map = (props: AssetProps) => {
  const [isHovered, setHover] = useState(false);
  const [pointerPosition, setPointer] = useState<Vector3>();
  return (
    <Suspense fallback={<Hexel />}>
      <group>
        <Asset {...props}
          onPointerOver={e => setHover(true)}
          onPointerOut={e => setHover(false)}
          onPointerMove={e => setPointer(e.point)}
        />
        <Dom position={pointerPosition}>
          <ToolTip isVisible={isHovered}/>
        </Dom>
      </group>
    </Suspense>
  )
}