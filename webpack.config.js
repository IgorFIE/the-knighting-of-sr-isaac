const path = require('path');
const TerserPlugin = require("terser-webpack-plugin");

module.exports = {
  mode: 'production',
  entry: './src/main.js',
  output: {
    filename: 'main.js',
    path: path.resolve(__dirname, 'dist'),
  },
  devServer: {
    static: './dist',
  },
  performance: {
    hints: false
  },
  optimization: {
    minimize: true,
    minimizer: [
      new TerserPlugin({
        parallel: true,
        terserOptions: {
          // https://github.com/webpack-contrib/terser-webpack-plugin#terseroptions
          mangle: {
            properties: {
              keep_quoted: true,
              reserved: ['onOpen', 'onClose', 'onMessage']
            }
          },
          compress: {
            passes: 4,
            pure_getters: true
          },
          output: {
            wrap_func_args: false
          }
        },
      }),
    ],
  },
};