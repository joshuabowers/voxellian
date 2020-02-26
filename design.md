# Voxellian
*A voxel-ish tactical RPG written in WebGL*

## Inspirations
* Final Fantasy Tactics
* Disgaea
* X-Com Enemy Unknown

## Goals
* 3D maps built out in a hexagonal grid. Unlike modern X-Com, this will not be a tessellation laid over a 3D surface, but will rather be a volumetric map---e.g. Minecraft---comprised os individual hexagonal prisms. To facilitate more interesting visuals, the prisms may be non-uniform: e.g. a prism might be rendered at half-size or quarter-size to better represent steps.
* Non-map objects---in particular, characters---will be rendered as cuboid meshes. Essentially, smaller cubes arranged as a voxelized object. These are not similar to the design of characters in Minecraft; rather they are meant to look like super low poly 3D models.
* Combat within the game takes place in a turn-based fashion, where character order is dependent upon character speed, similar to FFT. Combat should actually be tactical, and have, similar to X-Com, a cover/flank mechanic, where players will be incentivized to manuever between cover to take on opponents. Similar to X-Com, character death is permanent. Similar to FFT and Disgaea, each character has a class with large development trees. Multi-classing should be possible, as should a respec feature.
* As maps are---essentially---hexagonal grids, a unit could have, at any moment, up to six directions they can attack in. They can also be flanked from three directions. Longer range attacks complicate this logic. 

## Structure
* Voxellian will have both a client and a server; the former handles most rendering and logic concerns, while the latter facilitates saving, loading, and---if implemented---multiplayer sessions. Game saves are only persisted if a save action occurs in the client, which updates the relevant information on the server.
* The server will be composed of three conceptual parts:
    1. node/express endpoint for delivering the frontend to the client.
    2. node/express api for persisting/providing data.
    3. mongodb, via mongoose, for data storage.

  Further additional components may be developed in the future to provide new functionality. For example, if multiplayer becomes a desirable stretch goal, the server would likely provide a mechanism to allow clients to communicate to one another via websockets.
* The client is much more complicated, as it is responsible for: Game logic, scripting/scene-planning, path-finding, UI/UX, 3D rendering, amongst other concepts.
    1. 3D rendering: Voxellian is, at its core, a video game. As such, it has visual rendering which needs happening. Modern browsers support 3D via an OpenGL derived technology called WebGL.[^WebGPU]
    2. UI/UX: The user interface for the game will be rendered via React

[^WebGPU] A newer technology, intended to both be a successor to WebGL, and less saddled with OpenGL cruft, called [WebGPU](https://en.wikipedia.org/wiki/WebGPU), is under development. It would be worth spending time ascertaining if it might be under a release cycle for modern browsers as a more feature robust alternative.