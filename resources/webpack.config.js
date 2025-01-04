// webpack.config.js
const path = require('path');
module.exports = {
	entry: {
		app: path.resolve(__dirname, 'js/app.js')
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
