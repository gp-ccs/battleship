module.exports = {
  extends: ['airbnb'],
  rules: {
    'jsx-a11y/media-has-caption': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/require-default-props': 'off',
    'react/no-danger': 'off',
    'react/prop-types': 'off',
    'no-console': 'off',
    'no-bitwise': 'off',
    'class-methods-use-this': 'off',
    'no-mixed-operators': 'off',
    'import/prefer-default-export': 'off',
    'import/no-named-as-default': 'off',
    'import/no-extraneous-dependencies': [
      'error',
      { devDependencies: true, optionalDependencies: false },
    ],
    'no-alert': 'off',
    'comma-dangle': [
      'error',
      {
        arrays: 'always-multiline',
        objects: 'always-multiline',
        imports: 'always-multiline',
        exports: 'always-multiline',
        functions: 'never',
      },
    ],
  },
  globals: {
    document: true,
    window: true,
    alert: true,
  },
  env: {
    jest: true,
  },
};
