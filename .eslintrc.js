module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    '@vue/prettier/@typescript-eslint'
  ],
  parserOptions: {
    parser: '@typescript-eslint/parser'
  },
  rules: {
    // 生产环境不可以使用console,debugger,可以配置webapack插件同意处理
    'no-console': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off',
    // 控制结尾符号,使用unix风格
    // 'linebreak-style': ['error', 'unix'],
    // 关闭没有使用的变量,js版
    'no-unused-var': 0,
    '@typescript-eslint/no-unused-vars': 0,
    // 关闭eslint中只能使用esm问题,关闭后可以使用commonjs
    '@typescript-eslint/no-var-requires': 0,
    // 这个是vue-eslint-plugin的一个bug,root标签无法使用v-if,v-else
    'vue/valid-template-root': 0,
    '@typescript-eslint/explicit-module-boundary-types': 0,
    // 关闭ts中不能使用this
    '@typescript-eslint/no-this-alias': 0,
    // 空函数
    'no-empty-function': 0,
    // 空函数
    '@typescript-eslint/no-empty-function': 0,
    // 可以使用禁止类型定义,如Object
    '@typescript-eslint/ban-types': 0,
    // 对象为空
    'no-empty': 0,
    // 判断语句中声明变量的问题
    'no-case-declarations': 0,
    '@typescript-eslint/interface-name-prefix': 0,
    '@typescript-eslint/array-type': 0,
    '@typescript-eslint/class-name-casing': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/camelcase': 0,
    '@typescript-eslint/explicit-member-accessibility': 0,
    '@typescript-eslint/no-angle-bracket-type-assertion': 0,
    '@typescript-eslint/no-explicit-any': 0,
    '@typescript-eslint/consistent-type-assertions': 0,
    // 不限制apply()
    'prefer-spread': 0,
    // 处理换行符
    'linebreak-style': ['off', 'windows']
  }
}
