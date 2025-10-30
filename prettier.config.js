/**
 * @see https://prettier.io/docs/configuration
 * @type {import("prettier").Config}
 */

export default {
  bracketSpacing: true,
  arrowParens: "always",
  semi: false,
  singleQuote: true,
  jsxSingleQuote: true,
  trailingComma: "all",
  plugins: [...(config.plugins || []), 'prettier-plugin-tailwindcss'],
}
