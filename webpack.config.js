const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = (env, argv) => {
  const isProduction = argv && argv['mode'] === 'production'
  const plugins = []

  if (!isProduction) {
    plugins.push(new HtmlWebpackPlugin({ template: path.join(__dirname, 'public', 'index.html') }))
  }

  return {
    entry: './src/index.ts',
    devtool: isProduction ? 'cheap-module-source-map' : 'inline-source-map',
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          use: 'ts-loader',
          exclude: /node_modules/
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        },
        {
          test: /\.(png|jpe?g|gif)$/i,
          use: [{ loader: 'file-loader' }]
        }
      ]
    },
    resolve: {
      extensions: ['.tsx', '.ts', '.js']
    },
    output: {
      filename: 'bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    plugins,
    devServer: {
      compress: true,
      port: 8080,
      contentBase: [path.join(__dirname, 'maps'), path.join(__dirname, 'public')]
    }
  }
}
