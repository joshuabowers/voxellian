class Shader {
  constructor( gl, source, type ) {
    this.gl = gl;
    this.source = source;
    this.type = type;
    this.id = null;
    this.loadFromSource();
  }

  loadFromSource() {
    if( !this.source ) {
      throw new Error( `No source found for shader!` )
    }

    if( !this.type
      || ![ this.gl.VERTEX_SHADER, this.gl.FRAGMENT_SHADER ].includes( this.type ) ){
      throw new TypeError( `No shader type provided for shader "${ this.source }"!` );
    }

    var shader = this.gl.createShader( this.type );
    this.gl.shaderSource( shader, this.source );
    this.gl.compileShader( this.shader );

    if( !this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS  ) ) {
      throw new Error( 'An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader) )
      this.gl.deleteShader( shader );
    }

    this.id = shader;
  }
}

export default Shader;
