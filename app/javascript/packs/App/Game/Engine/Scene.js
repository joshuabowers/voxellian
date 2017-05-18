import Pipeline from './Pipeline'

class Scene {
  // Might want to consider using Event / CustomEvent / subclass of CustomEvent
  // for the purposes of communicating GL context changes up and down a Scene.
  // This would also be a convenient way to communicate the creation of pipelines.
  constructor() {
    this.gl = null;
    this.pipelines = new Map();
  }

  glContextUpdated( gl ) {
    this.gl = gl;

    this.gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    this.gl.enable( this.gl.DEPTH_TEST );
    this.gl.depthFunc( this.gl.LEQUAL );
    this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

    // The following should probably be defined elsewhere, such as within a model
    // object, which would then let scene know what it has created.
    pipeline = new Pipeline(
      this.gl,
      [require( './Shaders/Cubel.vs' ), this.gl.VERTEX_SHADER],
      [require( './Shaders/Cubel.fs' ), this.gl.FRAGMENT_SHADER]
    );

    this.pipelines.set( 'Cubel', pipeline );
  }

  update() {

  }

  render() {

  }
}

export default Scene;
