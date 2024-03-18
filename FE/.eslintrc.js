module.exports = {
	env: {
		browser: true,
		es6: true,
		node: true
	},
	extends: ['airbnb', 'plugin:prettier/recommended'],
	rules: {
		'prettier/prettier': ['error', { endOfLine: 'auto' }],
		'import/prefer-default-export': 'off',
		'import/extensions': ['off'],
		'no-console': 'off',
		'no-alert': 'off',
		'no-restricted-globals': 'off',
		'no-new': 'off',
		'class-methods-use-this': 'off',
		'import/no-cycle': 'off',
		'no-restricted-syntax': 'off',
		'no-continue': 'off'
	}
};
