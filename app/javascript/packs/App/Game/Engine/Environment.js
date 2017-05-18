class Environment {
  constructor() {
    this.voxels = [];
  }

  update() {

  }

  render() {
    this.voxels.forEach( (voxel) => voxel.render() );
  }
}
