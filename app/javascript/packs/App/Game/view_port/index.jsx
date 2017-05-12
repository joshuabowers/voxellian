import React from 'react'
import { mat4, vec3, vec4 } from 'gl-matrix'

class ViewPort extends React.Component {
  static get FRAMERATE() {
    return 15;
  }

  constructor() {
    super();
    this.onResize = this.resize.bind(this);
    this.drawScene = this.drawScene.bind(this);

    this.matrices = {
      perspective: mat4.create(),
      camera: mat4.create()
    };

    this.gl = null;
  }

  componentDidMount() {
    console.log( 'Attempting to setup GL state...' );
    this.setupGLstate();
    console.log( 'GL state established!' );
  }

  setupGLstate() {
    this.initGL( this.canvas );

    if( !this.gl ){
      return;
    }

    this.gl.clearColor( 0.0, 0.0, 0.0, 1.0 );
    this.gl.enable( this.gl.DEPTH_TEST );
    this.gl.depthFunc( this.gl.LEQUAL );
    this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

    window.addEventListener( 'resize', this.onResize );

    this.initShaders();
    this.initBuffers();

    setInterval( this.drawScene, this.constructor.FRAMERATE );
    setTimeout( this.onResize, 10 );
  }

  initGL( element ) {
    this.gl = element.getContext('webgl') || canvas.getContext('experimental-webgl');

    if( !this.gl ){
      console.error( 'Unable to initialize WebGL. Your browser may not support it.' );
    }

    console.log( `Max Viewport Dimensions: ${ this.gl.getParameter( this.gl.MAX_VIEWPORT_DIMS ) }` );
  }

  initShaders() {
    var vertexShader = this.loadShader( require( './voxel.vs' ), this.gl.VERTEX_SHADER );
    var fragmentShader = this.loadShader( require( './voxel.fs' ), this.gl.FRAGMENT_SHADER );

    this.shaderProgram = this.gl.createProgram();
    this.gl.attachShader( this.shaderProgram, vertexShader );
    this.gl.attachShader( this.shaderProgram, fragmentShader );
    this.gl.linkProgram( this.shaderProgram );

    if( !this.gl.getProgramParameter( this.shaderProgram, this.gl.LINK_STATUS ) ){
      console.error('Unable to initialize the shader program: ' + this.gl.getProgramInfoLog(this.shaderProgram));
    }

    this.gl.useProgram( this.shaderProgram );

    this.vertexPositionAttribute = this.gl.getAttribLocation( this.shaderProgram, 'aVertexPosition' );
    this.gl.enableVertexAttribArray( this.vertexPositionAttribute );
  }

  loadShader( source, type ) {
    if( !source ) {
      console.error( `No source found for shader!` );
      return null;
    }

    if( !type
      || ![ this.gl.VERTEX_SHADER, this.gl.FRAGMENT_SHADER ].includes( type ) ){
      console.error( `No shader type provided for shader "${ source }"!` );
      return null;
    }

    var shader = this.gl.createShader( type );
    this.gl.shaderSource( shader, source );
    this.gl.compileShader( shader );

    if( !this.gl.getShaderParameter( shader, this.gl.COMPILE_STATUS  ) ) {
      console.error( 'An error occurred compiling the shaders: ' + this.gl.getShaderInfoLog(shader) );
      this.gl.deleteShader( shader );
      return null;
    }

    return shader;
  }

  initBuffers() {
    var squareVerticesBuffer = this.gl.createBuffer();
    this.gl.bindBuffer( this.gl.ARRAY_BUFFER, squareVerticesBuffer );

    var vertices = [
      1.0, 1.0, 0.0,
      -1.0, 1.0, 0.0,
      1.0, -1.0, 0.0,
      -1.0, -1.0, 0.0
    ];

    this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( vertices ), this.gl.STATIC_DRAW );

    this.buffers = { square: squareVerticesBuffer };
  }

  onResize() {
    this.didResize = true;
  }

  resize() {
    var canvas = this.canvas;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.gl.viewport( 0, 0, canvas.clientWidth, canvas.clientHeight );

    this.didResize = false;
  }

  drawScene() {
    var perspective = this.matrices.perspective;
    var camera = this.matrices.camera;
    var cameraPosition = vec3.fromValues( 0, 0, -6.0 );
    var canvas = this.canvas;

    if( this.didResize ){ this.resize(); }

    this.gl.clear( this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT );

    mat4.perspective( perspective, 45, this.aspectRatio(), 0.1, 100.0 );
    mat4.fromTranslation( camera, cameraPosition );

    this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffers.square );
    this.gl.vertexAttribPointer( this.vertexPositionAttribute, 3, this.gl.FLOAT, false, 0, 0 );

    this.matrixUniform( 'uPMatrix', this.matrices.perspective );
    this.matrixUniform( 'uMVMatrix', this.matrices.camera );

    this.gl.drawArrays( this.gl.TRIANGLE_STRIP, 0, 4 );
  }

  matrixUniform( identifier, matrix ) {
    var uniform = this.gl.getUniformLocation( this.shaderProgram, identifier );
    this.gl.uniformMatrix4fv( uniform, false, new Float32Array( matrix ) );
  }

  get canvas() {
    return document.getElementById('view-port');
  }

  aspectRatio() {
    var canvas = this.canvas;
    return canvas ? canvas.clientWidth / canvas.clientHeight : 0.0;
  }

  render() {
    return <canvas id='view-port' />;
  }
}

export default ViewPort;
