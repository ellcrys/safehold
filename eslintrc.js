module.exports = {
	root: true,
	parser: 'babel-eslint',
	parserOptions: {
		sourceType: 'module'
	},
	env: {
		browser: true,
		node: true
	},
	extends: 'standard',
	globals: {
		__static: true
	},
	plugins: [
		'html'
	],
	'rules': {
		'quotes': [2, "single"],
		'semi': [2, "always"],
		"indent": [2, "tab"],
		"space-before-function-paren": [2, "never"],
		"operator-linebreak": [2, "after"],
		"no-tabs": 0,
		"comma-dangle": [2, "always-multiline"],
		// allow paren-less arrow functions
		'arrow-parens': 0,
		// allow async-await
		'generator-star-spacing': 0,
		// allow debugger during development
		'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
	}
}
