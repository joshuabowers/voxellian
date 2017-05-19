class Model {
  constructor( gl ) {
    this.gl = gl;
    this.buffers = {};
    this.createBuffer();
  }

  createBuffer() {

  }

  bufferData( bufferType, data, bufferStability = this.gl.STATIC_DRAW ) {
    let bufferId = this.gl.createBuffer();
    this.gl.bindBuffer( bufferType, bufferId );
    this.gl.bufferData( bufferType, data, bufferStability );
    return bufferId;
  }

  shaderInput() {
    
  }

  update() {

  }

  render() {

  }
}

export default Model;
