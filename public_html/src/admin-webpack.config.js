// webpack.config.js
const path = require('path');
module.exports = {
  entry: {
    admin: path.resolve(__dirname, 'admin/js/admin.js'),
  },
  output: {
    path: path.resolve(__dirname, '../public_html/assets/js'),
  },
  devtool: false,
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
        },
      },
    ],
  }
};
