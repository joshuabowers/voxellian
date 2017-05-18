import Shader from './Shader'

class Pipeline {
  constructor( gl, ...shaders ) {
    this.gl = gl;

    if( shaders.size < 2 ){
      throw new Error( 'A pipeline requires at least two shaders to function!' );
    }

    this.id = this.gl.createProgram();

    this.shaders = shaders.map( ({ source, type }) => new Shader( source, type ) );

    this.shaders.forEach( shader => this.gl.attachShader( this.id, shader.id ) );
    this.gl.linkProgram( this.id );

    if( !this.gl.getProgramParameter( this.id, this.gl.LINK_STATUS ) ){
      throw new Error( 'Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.id) );
    }
  }

  use() {
    this.gl.useProgram( this.id );

    // The following should probably be extracted into (likely) model...
    // Note that, probably, this only needs to be performed once.
    this.vertexPositionAttribute = this.gl.getAttribLocation( this.id, 'aVertexPosition' );
    this.gl.enableVertexAttribArray( this.vertexPositionAttribute );
  }
}

export default Pipeline;
