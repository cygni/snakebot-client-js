module.exports = {
    root: true,
    parser: 'babel-eslint',
    parserOptions: {
        sourceType: 'module'
    },
    extends: 'airbnb-base',
    // required to lint *.vue files
    globals: {
        'window': true
    },
    'settings': {
    },
    // add your custom rules here
    'rules': {
        'indent': [2, 4, {
            "VariableDeclarator": { "var": 2, "let": 2, "const": 3 },
            "CallExpression": {"arguments": "first"}
        }],
        "function-paren-newline": ["error", "consistent"],
        "max-len": 0,
        'no-param-reassign': [2, { 'props': false }],
        'global-require': 0,
        'comma-dangle': 0,

        // allow console during development
        'no-console': process.env.NODE_ENV === 'production' ? 0 : 0,

        // allow debugger during development
        'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,

        'no-underscore-dangle': ['error', { 'allow': ['resp', '_fields', '_stats'] }]
    }
};
