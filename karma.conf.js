module.exports = function(config) {
	config.set({
		frameworks: ['mocha'],
		plugins: [
			'karma-mocha',
      'karma-mocha-reporter',
			'karma-chrome-launcher',
			'karma-webpack',
      'karma-sourcemap-loader'
		],
		files: [
			'test/*.test.js'
		],
		preprocessors: {
			'test/*.test.js': ['webpack', 'sourcemap']
		},
		reporters: ['mocha'],
		browsers: ['Chrome'],
		singleRun: true,
		webpack: {
			quiet: true,
			module: {
				loaders: [
					{
						test: /\.js$/,
						exclude: /node_modules/,
						loaders: [
							'babel?optional[]=runtime',
							'imports?define=>false'
						]
					}
				],
  				noParse: [
					/\/sinon\.js/,
				]
			},
      devtool: 'inline-source-map'
		},
		webpackMiddleware: {
			noInfo: true
		}
	});
};