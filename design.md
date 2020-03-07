# Voxellian
*A voxel-ish tactical RPG written in WebGL*

## Inspirations
* Final Fantasy Tactics
* Disgaea
* X-Com Enemy Unknown

## Goals
* 3D maps built out in a hexagonal grid. Unlike modern X-Com, this will not be a tessellation laid over a 3D surface, but will rather be a volumetric map---e.g. Minecraft---comprised of individual hexagonal prisms. To facilitate more interesting visuals, the prisms may be non-uniform: e.g. a prism might be rendered at half-size or quarter-size to better represent steps.
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
* The client is much more complicated, as it is responsible for: Game logic, scripting/scene-planning, UI/UX, 3D rendering, amongst other concepts.
    1. 3D rendering: Voxellian is, at its core, a video game. As such, it has visual rendering which needs happening. Modern browsers support 3D via an OpenGL derived technology called WebGL.[WebGPU] WebGL provides a means to turn a HTML `<canvas>` element into a 3D rendering pipeline; this pipeline allows for the definition of both a fragment and a vertex shader in the OpenGL ES Shading Language (GLSL ES). While not as flexible as desktop variants, this should nevertheless provide a degree of interesting rendering potential for the game.
    2. UI/UX: The user interface for the game will be rendered via React. A component will be designed to control and manage the `<canvas>` WebGL context; additional components will be layered on top of this previous component to render the UI. This sidesteps the need to develop rendering logic for UI dialogs and text within WebGL; the browser already is capable of doing this! (Note: untested, might burn down, fall over, then sink unceremoniously into a swamp.) These React components will have their data provided by a Redux store.
    3. Game logic could---potentially---be handled as a side-effect of providing the data management for React/Redux: the client will have Redux Saga present for performing event-based and asynchronous activities---e.g. network transfers; this saga pipeline could be extended to also handle hooks for a script system, as well as provide a way of actually defining the main game loop. This system would be almost completely decoupled from the rendering pipelines, so experimentation would be needed to ascertain viability.

[WebGPU]: A newer technology, intended to both be a successor to WebGL, and less saddled with OpenGL cruft, called [WebGPU](https://en.wikipedia.org/wiki/WebGPU), is under development. It would be worth spending time ascertaining if it might be under a release cycle for modern browsers as a more feature robust alternative.

## Rendering

Voxellian will predominantly be rendered via two distinct types of geometries: hexagonal prisms and cubes. The former will be used to construct landscapes; the latter will be used to build characters and decorative clutter. Further geometries will likely be needed: for example, curved paths would likely be desirable for visualizing character movement across maps.

### Libraries

One approach to construct the desired rendering mechanisms would be via a GL context on a `<canvas>` element and direct authorship of the required vertex and fragment shaders. This would require intimate knowledge of GLSL ES (the language of shaders). Further, this approach is open to derailment: unforeseen complications in authoring the shaders could disrupt development.

A secondary approach would utilize a higher level abstraction: some library which already provides the desired functionality without requiring intimate implementation details. Such a library could be found, for example, in [threejs](threejs.org).

As the game is going to reside within a React UX, using a library which better integrates Three with React would be ideal. Enter [react-three-fiber](https://github.com/react-spring/react-three-fiber), which, amongst other things, provides mechanisms for describing Three Scenes in a declarative fashion via JSX. This could potentially speed development immensely.

### Model Scale

Hexagonal prisms will define unit measurements for the game: each prism, unless otherwise modified, will default to unit length: the hexagonal end caps would have a diameter of 1, while the height of the adjoining quads would be 1. In the context of IRL measurements, 1 unit would equate to 1 meter. Implication: 2 prisms of height is about the average height of a person. A humanoid character standing on a prism, therefore, would have about 0.8 m<sup>2</sup> of space to stand in.

Given this, the maximum size for standard humanoid characters would therefore be 1 horizontal prism by 2 horizontal prisms. This would equate to a volume of about 1.3 m<sup>3</sup>.

Cubes should be smaller than hexagonal prisms, as they collectively form a voxelized volumetric object. If the greatest extent of a cuboid grid defined within the volume of a single prism (~ 0.65 m<sup>3</sup>) is 10x10x10 cubes---i.e. 1000---then an individual cube would have a volume roughly of 0.00065 m<sup>3</sup>; this would translate to a side length of about 0.087 m.

For efficiency when rendering things, volumetric objects should not utilize the full 1000-2000 cube grid spaces they have access to! Further, unless needed for transparency, the internals of the objects should definitely not be rendered, nor even necessarily modeled.

(Note: these numbers are based off of very rough calculations; they will be subject to change as the game is developed.)

### Aesthetic

The two types of principle geometry in voxellian will have drastically different aesthetics. Cubes, being intentionally smaller, should be thought of analogously to pixels within a three dimensional space---i.e. voxels. Hexagonal prisms, on the other hand, are larger and should be capable of showing more surface detail---though hopefully without having to otherwise increase the amount of surface topology that might imply.

While the rendering aesthetics of these two concerns are subject to further decision making as development progresses, two distinctive styles have coalesced. 

For cubes, this will likely be either a [toon material](https://threejs.org/docs/index.html#api/en/materials/MeshToonMaterial) or a [phong](https://threejs.org/docs/index.html#api/en/materials/MeshPhongMaterial) material. While the toon material provides a unique visual effect, it might be lost on flat, non-curved surfaces, of which the volumetric objects will be comprised. Ergo, phong might make slightly more sense. In either case, the individual cubes can have specific material details applied to them, enabling each to form part of a larger picture. Note, the cubes should not be texture mapped: the entire point to use them to generate a low-res 3D model.

For prisms, ideally, either the [standard material](https://threejs.org/docs/index.html#api/en/materials/MeshStandardMaterial) or the [physical material](https://threejs.org/docs/index.html#api/en/materials/MeshPhysicalMaterial)---being implementations of PBR---would be ideal. (As these materials are much more expensive to implement, they might not be feasible for the intended scale of the game. Phong might be a suitable fallback.) In either of the ideal cases, a series of textures define physical aspects of the geometry they apply to, enabling, if done well, highly realistic and dynamic looking visuals. For more information about the realm of the possible, consult the article about [PBR](https://learnopengl.com/PBR/Theory) at learnopengl.com.

## State Machine

The game and its user interface will be---partially---controlled via a state machine. Current thought is to utilize redux saga to manage relationships between states, with dispatched actions to the redux store triggering state changes within the machine. The state machine itself may not be monolithic: there might be several to manage specific subsystems.

The state machines themselves are relatively trivial: they define transitional workflows to trigger alterations to the user interface or within the rendering context. Such systems are defined to ensure that UI components are rendered only when needed---as the user requests them, effectively.

For example, take into consideration a loop defined by the user being presented with the game's title screen upon first accessing the site, then being presented with a login/load game screen(s), followed by access to the game save; eventually the user decides to exit (or is timed out), or logs out, any of which causes the game to return to the title screen. Figuratively, such a workflow might be represented via:

```
titleScreen -> logIn -> selectSave -> loading -> game -> logOut -> titleScreen
```

## Game play

## Setting