module.exports = {
  test: /\.(glsl|vs|fs|gs|vert|frag|geom)?(\.erb)?$/,
  exclude: /node_modules/,
  loader: 'shader-loader'
}
