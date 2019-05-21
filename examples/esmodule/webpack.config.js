const path = require( "path" ),
      webpack = require( "webpack" ),
      TerserPlugin = require( "terser-webpack-plugin" );

module.exports = {
  entry: "./index.js",
  mode: process.env.NODE_ENV || "development",
  watchOptions: {
     ignored: /node_modules/
   },

  resolve: {
    extensions: [ ".js" ]
  },

  module: {
    rules: [{
      test: /.jsx?$/,
      exclude: /node_modules/,
      use: [{
        loader: "babel-loader",
        options: {
          presets: [
            [ "@babel/preset-env" ]
          ],
          plugins: [
            [ "@babel/plugin-proposal-decorators", { "legacy": true } ]
          ]
        }
      }]
    }]
  },

  output: {
    filename: `index.js`,
    path: path.resolve( __dirname, "dist" )
  },
  optimization: {
     minimizer: [
         new TerserPlugin(),
         new webpack.NormalModuleReplacementPlugin(
          /dist\/bycontract\.dev\.js/,
          ".\/bycontract.prod.js"
        )
     ]
  }
};