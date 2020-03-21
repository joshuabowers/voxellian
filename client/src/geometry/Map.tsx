import React, { Suspense } from 'react';
import { Hexel } from 'geometry/Hexel';
import { AssetProps, Asset } from 'geometry/Asset';

/**
 * Attempts to load a map from a GLTF asset located at url;
 * while the asset is unavailable, defaults to a rotation
 * hexagonal prism.
 * @param url the location of the map file. Should be within
 * the server public directory. 
 */
export const Map = (props: AssetProps) => {
  return (
    <Suspense fallback={<Hexel />}>
      <Asset {...props} />
    </Suspense>
  )
}