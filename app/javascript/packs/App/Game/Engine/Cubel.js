import Voxel from './Voxel'

class Cubel extends Voxel {
  // constructor() {
  //   super();
  // }

  original() {
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

  createBuffer() {
    let vertices = [
       0.5,  0.5,  0.5, // 0: front top right
       0.5, -0.5,  0.5, // 1: front bottom right
      -0.5, -0.5,  0.5, // 2: front bottom left
      -0.5,  0.5,  0.5, // 3: front top left
      -0.5,  0.5, -0.5, // 4: back top left
       0.5,  0.5, -0.5, // 5: back top right
       0.5, -0.5, -0.5, // 6: back bottom right
      -0.5, -0.5, -0.5, // 7: back bottom left
    ];
    let indices = [
      0, 1, 3,  // Front face, top
      1, 2, 3,  // Front face, bottom
      3, 2, 4,  // Left face, top
      2, 7, 4,  // Left face, bottom
      4, 7, 5,  // Back face, top
      7, 6, 5,  // Back face, bottom
      5, 6, 0,  // Right face, top
      6, 1, 0,  // Right face, bottom
      5, 0, 4,  // Top face, back
      0, 3, 4,  // Top face, front
      6, 1, 7,  // Bottom face, back
      1, 2, 7,  // Bottom face, front
    ];

    this.buffers.vertices = this.gl.createBuffer();
    this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffers.vertices );
    this.gl.bufferData( this.gl.ARRAY_BUFFER, new Float32Array( vertices ), this.gl.STATIC_DRAW );

    this.buffers.indices = this.gl.createBuffer();
    this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices );
    this.gl.bufferData( this.gl.ELEMENT_ARRAY_BUFFER, new Uint16Array( indices ), this.gl.STATIC_DRAW );
  }

  render() {
    this.gl.bindBuffer( this.gl.ARRAY_BUFFER, this.buffers.vertices );
    this.gl.bindBuffer( this.gl.ELEMENT_ARRAY_BUFFER, this.buffers.indices );

    // Here, the code for setting the position attribute and model uniform should occur.
    // Delegate to super?

    this.gl.drawElements( this.gl.TRIANGLES, 36, this.gl.UNSIGNED_SHORT, 0 );
  }
}

export default Cubel;
