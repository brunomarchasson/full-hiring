import pluginJs from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  { files: ["src/**/*.{js,mjs,cjs,ts}"] },

  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
  {
    languageOptions: {
      globals: {
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module'
      }
    },
    rules: {
      'padded-blocks': ['error', {
        blocks: 'never',
        classes: 'never',
        switches: 'never',
      }, {
        allowSingleLineBlocks: true,
      }],
      'object-curly-spacing': ["error", "always"],
      'padding-line-between-statements': 'off',
      'no-multiple-empty-lines': ['error', { max: 1, maxBOF: 0, maxEOF: 0 }],
      'indent': ['error', 2]
    }
  }
];