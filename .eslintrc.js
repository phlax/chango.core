module.exports = {
    "extends": [
	"eslint:recommended",
    ],
    env: {
	browser: true,
	"jest/globals": true
    },
    parser: "babel-eslint",
    parserOptions: {
	ecmaVersion: 6,
	ecmaFeatures: {
	    jsx: true,
	},
	sourceType: 'module',
    },
    globals: {
	gettext: false,
	ngettext: false,
	interpolate: false,
	l: false,
	expect: false,
	test: false,
	browser: false,
	jest: false,
	Promise: false,
	require: false,
	shortcut: false,
	sorttable: false,
	module: false,
	global: false
    },
    plugins: [
	'babel',
	'jest'
    ],
    rules: {
	'babel/new-cap': 1,
	'babel/camelcase': 1,
	'babel/no-invalid-this': 1,
	'babel/object-curly-spacing': 1,
	'babel/quotes': 1,
	'babel/semi': 1,
	"no-unused-vars": [1, { "ignoreRestSiblings": true }],
	'babel/valid-typeof': 1,
	"jest/no-disabled-tests": "warn",
	"jest/no-focused-tests": "error",
	"jest/no-identical-title": "error",
	"jest/prefer-to-have-length": "warn",
	"jest/valid-expect": "error"
    },
};
