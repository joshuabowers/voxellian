import React from 'react'

class ViewPort extends React.Component {
  static get FRAMERATE() {
    return 15;
  }

  constructor() {
    super();
    this.resize = this.resize.bind(this);
    this.drawScene = this.drawScene.bind(this);
  }

  componentDidMount() {
    console.log( 'Attempting to setup GL state...' );
    this.setupGLstate();
    console.log( 'GL state established!' );
  }

  setupGLstate() {
    var gl = this.initGL( this.canvas );

    if( !gl ){
      return;
    }

    gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    gl.enable( gl.DEPTH_TEST );
    gl.depthFunc( gl.LEQUAL );
    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    window.addEventListener( 'resize', this.resize );

    this.initShaders( gl );
    this.initBuffers( gl );

    this.setState( { gl: gl } );

    setInterval( this.drawScene, this.constructor.FRAMERATE );
  }

  initGL( element ) {
    var gl = null;

    gl = element.getContext('webgl') || canvas.getContext('experimental-webgl');

    if( !gl ){
      console.error( 'Unable to initialize WebGL. Your browser may not support it.' );
    }

    return gl;
  }

  initShaders( gl ) {
    var vertexShader = this.loadShader( gl, require( './voxel.vs' ), gl.VERTEX_SHADER );
    var fragmentShader = this.loadShader( gl, require( './voxel.fs' ), gl.FRAGMENT_SHADER );

    var shaderProgram = gl.createProgram();
    gl.attachShader( shaderProgram, vertexShader );
    gl.attachShader( shaderProgram, fragmentShader );
    gl.linkProgram( shaderProgram );

    if( !gl.getProgramParameter( shaderProgram, gl.LINK_STATUS ) ){
      console.error('Unable to initialize the shader program: ' + gl.getProgramInfoLog(shaderProgram));
    }

    gl.useProgram( shaderProgram );

    var vertexPositionAttribute = gl.getAttribLocation( shaderProgram, 'aVertexPosition' );
    gl.enableVertexAttribArray( vertexPositionAttribute );
  }

  loadShader( gl, source, type ) {
    if( !source ) {
      console.error( `No source found for shader!` );
      return null;
    }

    if( !type
      || ![ gl.VERTEX_SHADER, gl.FRAGMENT_SHADER ].includes( type ) ){
      console.error( `No shader type provided for shader "${ source }"!` );
      return null;
    }

    var shader = gl.createShader( type );
    gl.shaderSource( shader, source );
    gl.compileShader( shader );

    if( !gl.getShaderParameter( shader, gl.COMPILE_STATUS  ) ) {
      console.error( 'An error occurred compiling the shaders: ' + gl.getShaderInfoLog(shader) );
      gl.deleteShader( shader );
      return null;
    }

    return shader;
  }

  initBuffers( gl ) {
    var squareVerticesBuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, squareVerticesBuffer );

    var vertices = [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    gl.bufferData( gl.ARRAY_BUFFER, new Float32Array( vertices ), gl.STATIC_DRAW );

    this.setState( { buffers: { square: squareVerticesBuffer } })
  }

  resize() {
    var gl = this.state.gl;
    var canvas = this.canvas;

    gl.viewport( 0, 0, canvas.width, canvas.height );

    this.setState( { gl: gl } );
  }

  drawScene() {
    var gl = this.state.gl;

    gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT );

    gl.bindBuffer( gl.ARRAY_BUFFER, this.state.buffers.square );
    // gl.vertexAttribPointer( )
  }

  get canvas() {
    return document.getElementById('view-port');
  }

  render() {
    return <canvas id='view-port' />;
  }
}

export default ViewPort;
