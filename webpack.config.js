const path = require( "path" ),
      TerserPlugin = require( "terser-webpack-plugin" );

module.exports = {
  entry: "./src/bycontract.dev.ts",
  mode: "production",
  watchOptions: {
     ignored: /node_modules/
   },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: "ts-loader",
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ ".ts", ".js" ]
  },
  output: {
    filename: `byContract.min.js`,
    path: path.resolve( __dirname, "dist" ),
    libraryTarget: "umd",
    library: "lib",
    umdNamedDefine: true,
    globalObject: `(typeof self !== 'undefined' ? self : this)`
  },
  optimization: {
     minimizer: [
         new TerserPlugin()
     ]
  }
};