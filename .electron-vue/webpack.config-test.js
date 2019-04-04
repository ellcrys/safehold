const path = require('path');
const nodeExternals = require('webpack-node-externals');
const webpack = require('webpack');

module.exports = {
	entry: {
		main: path.join(__dirname, './src/main/index.js'),
	},
	devtool: 'inline-source-map',
	target: 'node',
	externals: [nodeExternals()],
	mode: 'development',
	node: {
		__dirname: false,
	},
	module: {
		rules: [
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	plugins: [
		new webpack.DefinePlugin({
			__static: `"${path
				.join(__dirname, './static')
				.replace(/\\/g, '\\\\')}"`,
		}),
	],
};
