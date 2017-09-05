module.exports = {
	entry: "./app/react_modules/main.jsx",
	output: {
		filename: "./app/bundle.js"
	},
	module: {
		loaders: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				loader: 'babel-loader',
				query: {
					presets: ['react', 'es2015']
				}
			}
		],
	},	
	resolve: {
		extensions: ['', '.js', '.jsx', '.es6']
	},
	watch: true
}