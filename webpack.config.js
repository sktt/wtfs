const path = require('path')
const webpack = require('webpack')

const DIST_PATH = path.join(__dirname, 'dist')
const SRC_PATH = path.join(__dirname, 'src')

module.exports = {
  devtool: 'source-map',
  cache: 'true',
  entry: [
    'webpack-dev-server/client?http://localhost:8080',
    'webpack/hot/dev-server',
    `${SRC_PATH}/main.js`
  ],
  output: {
    path: DIST_PATH,
    filename: 'main.js'
    //publicPath: '/static/'
  },
  target: 'web',
  resolve: {
    extensions: ['', '.js', '.jsx']
  },
  plugins: [
    new webpack.NoErrorsPlugin()
  ],
  node: {
    fs: 'empty'
  },
  module: {
    loaders: [
      {
        test: /\.json$/,
        include: path.join(__dirname, 'node_modules', 'pixi.js'),
        loader: 'json'
      },
      { test: /\.jsx?$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      { test: /\.scss$/,
        loaders: ['style', 'css', 'sass?outputStyle=expanded']
      }
    ]
  }
}
