module.exports = {
  /**
   * https://github.com/AlloyTeam/eslint-config-alloy/blob/master/README.zh-CN.md
   */
  extends: ['alloy', 'alloy/react', 'alloy/typescript'],
  plugins: ['react-hooks', 'import', 'prettier'],
  env: {
    browser: true,
    es6: true
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  rules: {
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'off',
    'prettier/prettier': 'error',
    'vue/html-indent': 'off',
    'vue/max-attributes-per-line': 'off',
    'vue/html-self-closing': 'off',
    'max-lines': ['warn', {max: 500}],
    'max-len': ['warn', {code: 120}],
    'default-case-last': 'off',
    'no-undef': 'off',
    'no-useless-backreference': 'off',
    'react-hooks/rules-of-hooks': 'error', // 检查 Hook 的规则
    'react-hooks/exhaustive-deps': ['error', {
      "additionalHooks": "(useCreation|useDebounceEffect|useThrottleEffect)",
    }],
    '@typescript-eslint/member-ordering': 'off',
    'max-nested-callbacks': 'off',
    '@typescript-eslint/explicit-member-accessibility': 'off',
    'no-async-promise-executor': 'warn',
    '@typescript-eslint/consistent-type-assertions': 'off',
    'no-param-reassign': 'warn',
    'no-promise-executor-return': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-eq-null': 'off',
    'no-useless-concat': 'warn',
    eqeqeq: ['error', 'always', {null: 'ignore'}],
    radix: 'warn',
    'react/jsx-no-useless-fragment': 'warn',
    '@typescript-eslint/no-unused-vars': 'warn',
    '@typescript-eslint/no-require-imports': 'warn',
    '@typescript-eslint/no-empty-interface': 'warn',
    'max-params': ['warn', {max: 5}],
    complexity: ['error', {max: 40}],
    'prefer-const': 'warn',
    'import/order': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'import/no-cycle': 'error',
    'no-case-declarations': 'off',
    'react/jsx-uses-react': 'off',
    'react/react-in-jsx-scope': 'off',
    'prefer-arrow-callback': 'off'
  }
};
