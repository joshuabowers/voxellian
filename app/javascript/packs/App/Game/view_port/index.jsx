import React from 'react'

class ViewPort extends React.Component {
  constructor() {
    super();
    this.resize = this.resize.bind(this);
  }

  componentDidMount() {
    console.log( 'Attempting to setup GL state...' );
    this.setupGLstate();
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

    this.setState( { gl: gl } );
  }

  initGL( element ) {
    var gl = null;

    gl = element.getContext('webgl') || canvas.getContext('experimental-webjl');

    if( !gl ){
      console.error( 'Unable to initialize WebGL. Your browser may not support it.' )
    }

    return gl;
  }

  resize() {
    var gl = this.state.gl;
    var canvas = this.canvas;

    gl.viewport( 0, 0, canvas.width, canvas.height );

    this.setState( { gl: gl } );
  }

  get canvas() {
    return document.getElementById('view-port');
  }

  render() {
    return <canvas id='view-port' />;
  }
}

export default ViewPort;
